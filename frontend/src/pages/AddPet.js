import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Spinner, Alert, Form, Button } from 'react-bootstrap';

export default function AddPet() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [form, setForm]       = useState({ name:'', species:'', owner:'' });
  const nav = useNavigate();

  useEffect(() => {
    axios.get('/api/owners')
      .then(res => {
        if(res.data.success) setOwners(res.data.data);
        else setError('Échec chargement propriétaires');
      })
      .catch(()=>setError('Erreur réseau'))
      .finally(()=>setLoading(false));
  }, []);

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/api/pets', form)
      .then(res => nav('/pets'))
      .catch(err => setError(err.response?.data?.error || 'Erreur serveur'));
  };

  if(loading) return <Container className="mt-5 pt-5 text-center"><Spinner animation="border"/></Container>;

  return (
    <Container className="mt-5 pt-3" style={{maxWidth:'600px'}}>
      <h2>Ajouter un animal</h2>
      {error && <Alert variant="danger">{error}</Alert>}

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
        <Form.Group className="mb-3">
          <Form.Label>Propriétaire</Form.Label>
          <Form.Select
            name="owner"
            value={form.owner}
            onChange={handleChange}
            required
          >
            <option value="">― Choisir ―</option>
            {owners.map(o => (
              <option key={o._id} value={o._id}>
                {o.firstName} {o.lastName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" className="me-2">Enregistrer</Button>
        <Button variant="secondary" onClick={()=>nav(-1)}>Annuler</Button>
      </Form>
    </Container>
  );
}
