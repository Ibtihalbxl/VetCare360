import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Card, Form, Button, Alert, Spinner
} from 'react-bootstrap';

export default function AddVisit() {
  const { petId: paramPetId } = useParams(); 
  const navigate = useNavigate();

  const [pets, setPets]       = useState([]);
  const [vets, setVets]       = useState([]);
  const [petId, setPetId]     = useState(paramPetId || '');
  const [vetId, setVetId]     = useState('');
  const [date, setDate]       = useState('');
  const [reason, setReason]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/pets'),
      axios.get('/api/vets')
    ])
    .then(([petsRes, vetsRes]) => {
      if (petsRes.data.success) setPets(petsRes.data.data);
      if (vetsRes.data.success) setVets(vetsRes.data.data);
      if (paramPetId) setPetId(paramPetId);
    })
    .catch(() => setError('Erreur chargement données'))
    .finally(() => setLoading(false));
  }, [paramPetId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!petId || !vetId || !date) {
      setError('Sélectionne l’animal, le vétérinaire et la date.');
      return;
    }
    setError('');
    try {
      await axios.post('/api/visits', { pet: petId, vet: vetId, date, reason });
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur serveur');
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      <Card className="mx-auto" style={{ maxWidth: 600 }}>
        <Card.Body>
          <h2 className="text-center mb-4">Ajouter une visite</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Animal</Form.Label>
              <Form.Select
                value={petId}
                onChange={e => setPetId(e.target.value)}
                required
              >
                <option value="">-- Choisissez un animal --</option>
                {pets.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} {p.species ? `(${p.species})` : ''}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vétérinaire</Form.Label>
              <Form.Select
                value={vetId}
                onChange={e => setVetId(e.target.value)}
                required
              >
                <option value="">-- Choisissez un vétérinaire --</option>
                {vets.map(v => (
                  <option key={v._id} value={v._id}>
                    {v.firstName} {v.lastName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

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
