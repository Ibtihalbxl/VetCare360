
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaUserFriends,
  FaStethoscope,
  FaPaw,
  FaCalendarCheck
} from 'react-icons/fa';


import bannerAnimals from '../assets/3a.jpg';

const sections = [
  { title: 'Propriétaires', icon: FaUserFriends, link: '/owners', color: '#e3f2fd' },
  { title: 'Vétérinaires', icon: FaStethoscope, link: '/vets',   color: '#f3e5f5' },
  { title: 'Animaux',      icon: FaPaw,        link: '/pets',   color: '#e8f5e9' },
  { title: 'Visites',      icon: FaCalendarCheck, link: '/visits', color: '#fff3e0' },
];

export default function Home() {
  return (
    <>
      <div className="home-hero d-flex align-items-center justify-content-center text-white">
        <Container className="text-center">
          <h1 className="display-4 fw-bold">Bienvenue sur VetCare 360</h1>
          <p className="lead">
            Gérez vos propriétaires, vétérinaires, animaux et visites en toute simplicité.
          </p>
        </Container>
      </div>

      <Container className="my-5">
        <Row xs={1} md={2} lg={4} className="g-4 mb-5">
          {sections.map(({ title, icon: Icon, link, color }) => (
            <Col key={title}>
              <Card className="h-100 text-center" style={{ background: color }}>
                <Card.Body className="d-flex flex-column align-items-center">
                  <Icon size={48} className="mb-3" />
                  <Card.Title>{title}</Card.Title>
                  <Button as={Link} to={link} variant="dark" className="mt-auto">
                    Accéder →
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {}
        <div className="home-banner-img-wrapper">
          <img src={bannerAnimals} alt="Animaux divers" className="home-banner-img" />
        </div>
      </Container>
    </>
  );
}
