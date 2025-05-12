import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/vet.jpg'; 
export default function Layout() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            <img
              alt="Logo"
              src={logo}
              height="30"
              className="d-inline-block align-top me-2"
            />
            VetCare 360
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/owners">Propriétaires</Nav.Link>
              <Nav.Link as={NavLink} to="/vets">Vétérinaires</Nav.Link>
              <Nav.Link as={NavLink} to="/pets">Animaux</Nav.Link>
              <Nav.Link as={NavLink} to="/visits">Visites</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {}
      <Outlet />
    </>
  );
}
