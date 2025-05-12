import React, { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddVet() {
  const nav = useNavigate();
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', specialty:'' });
  const [error, setError] = useState('');

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = e => {
    e.preventDefault();
    axios.post('/api/vets', form)
      .then(()=> nav('/vets'))
      .catch(err => setError(err.response?.data?.error || 'Erreur'));
  };

  return (
    <Container className="mt-5 pt-5">
      <Card className="mx-auto" style={{ maxWidth:600 }}>
        <Card.Body>
          <h2 className="mb-4 text-center">Ajouter un vétérinaire</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={submit}>
            {['firstName','lastName','email','phone','specialty'].map(name=>(
              <Form.Group key={name} className="mb-3">
                <Form.Label>{name.charAt(0).toUpperCase()+name.slice(1)}</Form.Label>
                <Form.Control
                  name={name}
                  type={name==='email'?'email':'text'}
                  value={form[name]}
                  onChange={change}
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
