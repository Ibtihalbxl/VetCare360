import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="sidebar bg-dark d-flex flex-column p-3">
      <h3 className="text-center text-white mb-4">🐾 VetCare 360</h3>
      <NavLink to="/" end className="nav-link mb-2">Accueil</NavLink>
      <NavLink to="/veterinaires" className="nav-link mb-2">Vétérinaires</NavLink>
      <NavLink to="/proprietaires" className="nav-link mb-2">Propriétaires</NavLink>
      <NavLink to="/proprietaires/nouveau" className="nav-link">Ajouter</NavLink>
    </nav>
  );
}
