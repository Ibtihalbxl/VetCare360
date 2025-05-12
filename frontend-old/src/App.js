// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import VetList from './pages/VetList';
import OwnerSearch from './pages/OwnerSearch';
import AddOwner from './pages/AddOwner';

export default function App() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/veterinaires" element={<VetList />} />
          <Route path="/proprietaires" element={<OwnerSearch />} />
          <Route path="/proprietaires/nouveau" element={<AddOwner />} />
        </Routes>
      </div>
    </div>
  );
}
