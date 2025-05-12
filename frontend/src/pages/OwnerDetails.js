import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Spinner,
  Alert,
  Button,
  Card,
  Table
} from 'react-bootstrap';

export default function OwnerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [owner, setOwner]     = useState(null);
  const [pets, setPets]       = useState([]);   
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    async function fetchAll() {
      try {
        
        const ownerRes = await axios.get(`/api/owners/${id}`);
        if (!ownerRes.data.success) throw new Error('Propriétaire introuvable');
        setOwner(ownerRes.data.data);

        
        const petsRes = await axios.get('/api/pets', { params: { owner: id } });
        const petsList = petsRes.data.success ? petsRes.data.data : [];

        
        const petsWithVisits = await Promise.all(
          petsList.map(async pet => {
            const visitsRes = await axios.get('/api/visits', { params: { pet: pet._id } });
            return {
              ...pet,
              visits: Array.isArray(visitsRes.data.data)
                      ? visitsRes.data.data
                      : []   
            };
          })
        );

        setPets(petsWithVisits);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || err.message || 'Erreur réseau');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [id]);

  const handleDeleteOwner = async () => {
    if (!window.confirm('Supprimer ce propriétaire ?')) return;
    await axios.delete(`/api/owners/${id}`);
    navigate('/owners');
  };
  const handleDeletePet = async petId => {
    if (!window.confirm('Supprimer cet animal ?')) return;
    await axios.delete(`/api/pets/${petId}`);
    setPets(p => p.filter(x => x._id !== petId));
  };
  const handleDeleteVisit = async visitId => {
    if (!window.confirm('Supprimer cette visite ?')) return;
    await axios.delete(`/api/visits/${visitId}`);
    setPets(pList =>
      pList.map(p => ({
        ...p,
        visits: (p.visits || []).filter(v => v._id !== visitId)
      }))
    );
  };

  if (loading) return (
    <Container className="pt-5 text-center">
      <Spinner animation="border" />
    </Container>
  );
  if (error) return (
    <Container className="pt-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container className="pt-5">
      {}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{owner.firstName} {owner.lastName}</h2>
          <p><strong>Email:</strong> {owner.email}</p>
          <p><strong>Téléphone:</strong> {owner.phone || '–'}</p>
        </div>
        <div>
          <Link to={`/owners/edit/${id}`}>
            <Button variant="secondary" className="me-2">Modifier propriétaire</Button>
          </Link>
          <Button variant="danger" onClick={handleDeleteOwner}>Supprimer propriétaire</Button>
        </div>
      </div>

      {}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Animaux</h4>
        <Link to={`/pets/add/${id}`}>
          <Button variant="primary">+ Ajouter animal</Button>
        </Link>
      </div>
      {pets.length === 0 && <Alert>Aucun animal pour ce propriétaire.</Alert>}

      {pets.map(pet => (
        <Card key={pet._id} className="mb-4">
          <Card.Body>
            {}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>{pet.name} ({pet.species || '–'})</h5>
              <div>
                <Link to={`/pets/edit/${pet._id}`}>
                  <Button variant="secondary" size="sm" className="me-2">
                    Modifier animal
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeletePet(pet._id)}
                >
                  Supprimer animal
                </Button>
              </div>
            </div>

            {}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>Visites à venir</strong>
              <Link to={`/visits/add/${pet._id}`}>
                <Button variant="success" size="sm">+ Ajouter visite</Button>
              </Link>
            </div>
            <Table size="sm" striped bordered>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                { (pet.visits || []).length > 0
                  ? (pet.visits || []).map(v => (
                      <tr key={v._id}>
                        <td>{new Date(v.date).toLocaleDateString()}</td>
                        <td>{v.reason || '–'}</td>
                        <td>
                          <Link to={`/visits/edit/${pet._id}/${v._id}`}>
                            <Button size="sm" className="me-2">Modifier visite</Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteVisit(v._id)}
                          >
                            Supprimer visite
                          </Button>
                        </td>
                      </tr>
                    ))
                  : (
                    <tr>
                      <td colSpan="3" className="text-center">Aucune visite à venir</td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
