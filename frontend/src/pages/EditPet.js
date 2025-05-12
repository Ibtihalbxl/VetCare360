import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Form, Button,
  Spinner, Alert
} from 'react-bootstrap';

export default function EditPet() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/pets/${id}`)
      .then(res => {
        if (res.data.success) setForm(res.data.data);
        else setError('Introuvable');
      })
      .catch(() => setError('Erreur réseau'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`/api/pets/${id}`, {
      name: form.name,
      species: form.species
    })
      .then(res => {
        if (res.data.success) nav(`/pets/${id}`);
        else setError('Validation échouée');
      })
      .catch(err => setError(err.response?.data?.error || 'Erreur serveur'));
  };

  if (loading) return (
    <Container className="mt-5 pt-5 text-center">
      <Spinner animation="border"/>
    </Container>
  );
  if (error) return (
    <Container className="mt-5 pt-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container className="mt-5 pt-3" style={{ maxWidth: 600 }}>
      <h2>Modifier l’animal</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Espèce</Form.Label>
          <Form.Control
            name="species"
            value={form.species}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit">Enregistrer</Button>{' '}
        <Link to={`/pets/${id}`}>
          <Button variant="secondary">Annuler</Button>
        </Link>
      </Form>
    </Container>
  );
}
