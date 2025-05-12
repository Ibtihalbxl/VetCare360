import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }  from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function EditVisit() {
  const { petId, visitId } = useParams();
  const navigate = useNavigate();

  const [visit, setVisit]   = useState(null);
  const [date, setDate]     = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    axios.get(`/api/visits/${visitId}`)
      .then(res => {
        const v = res.data.data;
        setVisit(v);
        setDate(v.date.slice(0,10));   
        setReason(v.reason || '');
      })
      .catch(() => setError('Erreur chargement'))
      .finally(() => setLoading(false));
  }, [visitId]);

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`/api/visits/${visitId}`, { date, reason })
      .then(() => navigate(-1))
      .catch(err => setError(err.response?.data?.error || 'Erreur'));
  };

  if (loading) return (
    <Container className="mt-5 pt-5 text-center"><Spinner animation="border" /></Container>
  );
  if (!visit) return null;

  return (
    <Container className="mt-5 pt-5">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: 600 }}>
        <Card.Body>
          <h2 className="text-center mb-4">Modifier la visite</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Date de visite</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit">Enregistrer</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
