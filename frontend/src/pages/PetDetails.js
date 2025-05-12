import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Spinner, Alert,
  Button, Table, Card
} from 'react-bootstrap';

export default function PetDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [pet, setPet]   = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, vRes] = await Promise.all([
          axios.get(`/api/pets/${id}`),
          axios.get(`/api/visits?pet=${id}`)
        ]);
        if (!pRes.data.success) throw new Error('Animal introuvable');
        setPet(pRes.data.data);
        setVisits(vRes.data.success ? vRes.data.data : []);
      } catch (err) {
        setError(err.message || 'Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm("Supprimer cet animal ?")) return;
    axios.delete(`/api/pets/${id}`)
      .then(() => nav('/pets'))
      .catch(() => alert('Erreur suppression'));
  };

  const handleDeleteVisit = vid => {
    if (!window.confirm("Supprimer cette visite ?")) return;
    axios.delete(`/api/visits/${vid}`)
      .then(() => setVisits(v => v.filter(x => x._id !== vid)))
      .catch(() => alert('Erreur suppression visite'));
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
    <Container className="mt-5 pt-3">
      <h2>{pet.name} ({pet.species||'–'})</h2>
      <p><strong>Propriétaire :</strong>{' '}
        {pet.owner
          ? `${pet.owner.firstName} ${pet.owner.lastName}`
          : '–'
        }
      </p>
      <div className="mb-3">
        <Link to={`/pets/edit/${id}`}>
          <Button variant="secondary" className="me-2">Modifier animal</Button>
        </Link>
        <Button variant="danger" onClick={handleDelete}>
          Supprimer animal
        </Button>
      </div>

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Visites à venir</strong>
            <Link to={`/visits/add/${id}`}>
              <Button size="sm" variant="success">+ Ajouter visite</Button>
            </Link>
          </div>
          <Table size="sm" striped bordered>
            <thead><tr>
              <th>Date</th><th>Raison</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {visits.length>0 ? visits.map(v=>(
                <tr key={v._id}>
                  <td>{new Date(v.date).toLocaleDateString()}</td>
                  <td>{v.reason||'–'}</td>
                  <td>
                    <Link to={`/visits/edit/${id}/${v._id}`}>
                      <Button size="sm" className="me-1">Modifier</Button>
                    </Link>
                    <Button size="sm" variant="danger"
                            onClick={()=>handleDeleteVisit(v._id)}>
                      Supprimer
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="text-center">Aucune visite à venir</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <div className="mt-4 text-center">
        <Link to="/pets">
          <Button variant="outline-secondary">← Retour à la liste des animaux</Button>
        </Link>
      </div>
    </Container>
  );
}
