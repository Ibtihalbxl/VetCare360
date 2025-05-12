// src/pages/VetList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Row,
  Col
} from 'react-bootstrap';

export default function VetList() {
  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');

  const fetchVets = () => {
    setLoading(true);
    axios.get('/api/vets')
      .then(res => {
        if (res.data.success) setList(res.data.data);
        else setError('Échec de la récupération');
      })
      .catch(() => setError('Erreur réseau'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVets();
  }, []);

  const handleDelete = id => {
    if (!window.confirm('Supprimer ce vétérinaire ?')) return;
    axios.delete(`/api/vets/${id}`)
      .then(() => setList(current => current.filter(v => v._id !== id)))
      .catch(() => alert('Erreur lors de la suppression'));
  };

  const filtered = list.filter(v => {
    const term = search.toLowerCase();
    return (
      v.firstName.toLowerCase().includes(term) ||
      v.lastName.toLowerCase().includes(term) ||
      (v.specialty || '').toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-3">
      {}
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Recherche par nom ou spécialité…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <InputGroup.Text>🔍</InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={{ span: 3, offset: 3 }} className="text-end">
          <Link to="/vets/add">
            <Button variant="primary">+ Vétérinaire</Button>
          </Link>
        </Col>
      </Row>

      {}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Spécialité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map(v => (
              <tr key={v._id}>
                <td>{v.firstName} {v.lastName}</td>
                <td>{v.email}</td>
                <td>{v.phone || '–'}</td>
                <td>{v.specialty || '–'}</td>
                <td>
                  <Link to={`/vets/${v._id}`}>
                    <Button size="sm" className="me-1">Voir</Button>
                  </Link>
                  <Link to={`/vets/edit/${v._id}`}>
                    <Button size="sm" variant="secondary" className="me-1">
                      Modifier
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(v._id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Aucun vétérinaire trouvé
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {}
      <Row className="mt-4">
        <Col className="text-center">
          <Link to="/">
            <Button variant="outline-secondary">
              ← Retour à l’accueil
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
