import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function EditOwner() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [form, setForm]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    axios.get(`/api/owners/${id}`)
      .then(res => setForm(res.data.data))
      .catch(() => setError('Erreur chargement'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`/api/owners/${id}`, form)
      .then(() => nav(`/owners/${id}`))
      .catch(err => setError(err.response?.data?.error || 'Erreur'));
  };

  if (loading) return <Container className="mt-5 pt-5 text-center"><Spinner /></Container>;
  if (!form)   return null;

  return (
    <Container className="mt-5 pt-5">
      <Card className="mx-auto" style={{ maxWidth: 600 }}>
        <Card.Body>
          <h2 className="text-center mb-4">Modifier un propriétaire</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {['firstName','lastName','email','phone','address','city','postalCode'].map(name => (
              <Form.Group key={name} className="mb-3">
                <Form.Label>{name.charAt(0).toUpperCase()+name.slice(1)}</Form.Label>
                <Form.Control
                  name={name}
                  type={name==='email'?'email':'text'}
                  value={form[name]|| ''}
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
