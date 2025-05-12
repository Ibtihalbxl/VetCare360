import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Spinner, Alert, Button, Table, Card, Row, Col } from 'react-bootstrap';

export default function VetDetails() {
  const { id } = useParams();
  const nav     = useNavigate();

  const [vet, setVet]         = useState(null);
  const [visits, setVisits]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const vetRes = await axios.get(`/api/vets/${id}`);
        if (!vetRes.data.success) throw new Error('Vétérinaire introuvable');
        setVet(vetRes.data.data);

        const visRes = await axios.get('/api/visits', { params: { vet: id } });
        const allVisits = visRes.data.success ? visRes.data.data : [];
        const upcoming = allVisits
          .filter(v => new Date(v.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setVisits(upcoming);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Erreur réseau');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleDeleteVisit = async visitId => {
    if (!window.confirm('Supprimer cette visite ?')) return;
    try {
      await axios.delete(`/api/visits/${visitId}`);
      setVisits(vs => vs.filter(v => v._id !== visitId));
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

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
    <Container className="mt-5 pt-5">
      <Row className="mb-4">
        <Col>
          <h2>{vet.firstName} {vet.lastName}</h2>
          <p><strong>Email :</strong> {vet.email}</p>
          <p><strong>Téléphone :</strong> {vet.phone || '–'}</p>
          <p><strong>Spécialité :</strong> {vet.specialty || '–'}</p>
        </Col>
        <Col className="text-end">
          <Link to={`/vets/edit/${id}`}>
            <Button variant="secondary" className="me-2">Modifier vétérinaire</Button>
          </Link>
          <Button variant="danger" onClick={async () => {
            if (window.confirm('Supprimer ce vétérinaire ?')) {
              await axios.delete(`/api/vets/${id}`);
              nav('/vets');
            }
          }}>
            Supprimer vétérinaire
          </Button>
        </Col>
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Visites à venir</h3>
        <Link to={`/visits/addVet/${id}`}>
          <Button variant="primary">+ Ajouter visite</Button>
        </Link>
      </div>

      {visits.length === 0 && (
        <Alert variant="info">Aucune visite à venir pour ce vétérinaire</Alert>
      )}

      {visits.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Animal</th>
              <th>Raison</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map(v => (
              <tr key={v._id}>
                <td>{new Date(v.date).toLocaleDateString()}</td>
                <td>{v.pet.name}</td>
                <td>{v.reason || '–'}</td>
                <td>
                  <Link to={`/visits/edit/${v.pet._id}/${v._id}`}>
                    <Button size="sm" className="me-2">Modifier visite</Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteVisit(v._id)}
                  >
                    Supprimer visite
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
