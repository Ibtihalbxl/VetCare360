import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container, Table, Button,
  Spinner, Alert, Row, Col,
  Form, InputGroup
} from 'react-bootstrap';

export default function PetsList() {
  const [pets, setPets]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');

  useEffect(() => {
    axios.get('/api/pets')
      .then(res => {
        if (res.data.success) setPets(res.data.data);
        else setError('Échec de la récupération');
      })
      .catch(() => setError('Erreur réseau'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = pets.filter(p => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.species || '').toLowerCase().includes(term) ||
      `${p.owner?.firstName||''} ${p.owner?.lastName||''}`.toLowerCase().includes(term)
    );
  });

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border"/></Container>;
  if (error)   return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Recherche par nom, espèce ou propriétaire…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <InputGroup.Text>🔍</InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={{ span: 3, offset: 3 }} className="text-end">
          <Link to="/pets/add">
            <Button>+ Animal</Button>
          </Link>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th><th>Espèce</th><th>Propriétaire</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? filtered.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.species}</td>
              <td>
                {p.owner
                  ? `${p.owner.firstName} ${p.owner.lastName}`
                  : '–'
                }
              </td>
              <td>
                <Link to={`/pets/${p._id}`}>
                  <Button size="sm">Voir</Button>
                </Link>{' '}
                <Link to={`/pets/edit/${p._id}`}>
                  <Button size="sm" variant="secondary">Modifier</Button>
                </Link>{' '}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (!window.confirm('Supprimer cet animal ?')) return;
                    axios.delete(`/api/pets/${p._id}`)
                      .then(() => setPets(ps => ps.filter(x => x._id !== p._id)))
                      .catch(() => alert('Erreur suppression'));
                  }}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="4" className="text-center">Aucun animal trouvé</td></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
