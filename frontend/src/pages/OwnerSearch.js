import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Table,
  Button,
  Spinner,
  Alert,
  Container,
  Form,
  InputGroup,
  Row,
  Col
} from 'react-bootstrap';

export default function OwnerSearch() {
  const [owners, setOwners]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOwners = () => {
    setLoading(true);
    axios.get('/api/owners')
      .then(res => {
        if (res.data.success) setOwners(res.data.data);
        else setError('Échec de la récupération');
      })
      .catch(() => setError('Erreur réseau'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleDelete = id => {
    if (!window.confirm('Supprimer ce propriétaire ?')) return;
    axios.delete(`/api/owners/${id}`)
      .then(() => {
        setOwners(cur => cur.filter(o => o._id !== id));
      })
      .catch(() => alert('Erreur lors de la suppression'));
  };

  const filtered = owners.filter(o => {
    const term = searchTerm.toLowerCase();
    return (
      o.firstName.toLowerCase().includes(term) ||
      o.lastName.toLowerCase().includes(term)
    );
  });

  if (loading) return (
    <Container className="mt-5 pt-5 text-center">
      <Spinner animation="border" />
    </Container>
  );
  if (error) return (
    <Container className="mt-5 pt-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container className="mt-5 pt-3">
      {}
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Recherche par prénom ou nom…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <InputGroup.Text>🔍</InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={{ span: 3, offset: 3 }} className="text-end">
          <Link to="/owners/add">
            <Button variant="primary">+ Propriétaire</Button>
          </Link>
        </Col>
      </Row>

      {}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom complet</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Ville</th>
            <th>Code postal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? filtered.map(o => (
            <tr key={o._id}>
              <td>{o.firstName} {o.lastName}</td>
              <td>{o.email}</td>
              <td>{o.phone || '–'}</td>
              <td>{o.address || '–'}</td>
              <td>{o.city || '–'}</td>
              <td>{o.postalCode || '–'}</td>
              <td>
                <Link to={`/owners/${o._id}`}>
                  <Button size="sm" className="me-1">Voir</Button>
                </Link>
                <Link to={`/owners/edit/${o._id}`}>
                  <Button size="sm" variant="secondary" className="me-1">Modifier</Button>
                </Link>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(o._id)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7" className="text-center">Aucun résultat</td>
            </tr>
          )}
        </tbody>
      </Table>

      {}
      <div className="text-center my-4">
        <Link to="/">
          <Button variant="outline-secondary">← Retour à l’accueil</Button>
        </Link>
      </div>
    </Container>
  );
}
