import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  InputGroup,
  Form
} from 'react-bootstrap';

export default function VisitList() {
  const [visits, setVisits]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');

  const fetchVisits = () => {
    setLoading(true);
    axios.get('/api/visits')
      .then(res => {
        if (res.data.success) setVisits(res.data.data);
        else setError('Échec de la récupération');
      })
      .catch(() => setError('Erreur réseau'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchVisits, []);

  const handleDelete = id => {
    if (!window.confirm('Supprimer cette visite ?')) return;
    axios.delete(`/api/visits/${id}`)
      .then(() => setVisits(v => v.filter(x => x._id !== id)))
      .catch(() => alert('Erreur lors de la suppression'));
  };

  const filtered = visits.filter(v => {
    const term = search.toLowerCase();
    const petName = v.pet?.name?.toLowerCase() || '';
    const ownerName = `${v.pet?.owner?.firstName || ''} ${v.pet?.owner?.lastName || ''}`.toLowerCase();
    return (
      v.reason?.toLowerCase().includes(term) ||
      petName.includes(term) ||
      ownerName.includes(term)
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
        <Row className="mt-4">
          <Col className="text-center">
            <Link to="/">
              <Button variant="outline-secondary">← Retour à l’accueil</Button>
            </Link>
          </Col>
        </Row>
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
              placeholder="Recherche par animal, propriétaire ou raison…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <InputGroup.Text>🔍</InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={{ span: 3, offset: 3 }} className="text-end">
          <Link to="/visits/add/">
            <Button variant="primary">+ Ajouter visite</Button>
          </Link>
        </Col>
      </Row>

      {}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Animal</th>
            <th>Propriétaire</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? filtered.map(v => (
            <tr key={v._id}>
              <td>{new Date(v.date).toLocaleDateString()}</td>
              <td>{v.reason || '–'}</td>
              <td>{v.pet?.name || '–'}</td>
              <td>
                {v.pet?.owner
                  ? `${v.pet.owner.firstName} ${v.pet.owner.lastName}`
                  : '–'}
              </td>
              <td>
                <Link to={`/visits/edit/${v.pet?._id || ''}/${v._id}`}>
                  <Button size="sm" className="me-1">Modifier</Button>
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
          )) : (
            <tr>
              <td colSpan="5" className="text-center">Aucune visite trouvée</td>
            </tr>
          )}
        </tbody>
      </Table>

      {}
      <Row className="mt-4">
        <Col className="text-center">
          <Link to="/">
            <Button variant="outline-secondary">← Retour à l’accueil</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
