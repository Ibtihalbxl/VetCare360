import React, { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddOwner() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'', address:'', city:'', postalCode:''
  });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/api/owners', form)
      .then(() => nav('/owners'))
      .catch(err => setError(err.response?.data?.error || 'Erreur'));
  };

  return (
    <Container className="mt-5 pt-5">
      <Card className="mx-auto" style={{ maxWidth: 600 }}>
        <Card.Body>
          <h2 className="text-center mb-4">Ajouter un propriétaire</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {['firstName','lastName','email','phone','address','city','postalCode'].map(name => (
              <Form.Group key={name} className="mb-3">
                <Form.Label>{name.charAt(0).toUpperCase()+name.slice(1)}</Form.Label>
                <Form.Control
                  name={name}
                  type={name==='email'?'email':'text'}
                  value={form[name]}
                  onChange={handleChange}
                  required={['firstName','lastName','email'].includes(name)}
                />
              </Form.Group>
            ))}
            <div className="text-end">
              <Button type="submit">Enregistrer</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
