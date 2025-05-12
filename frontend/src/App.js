import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Layout from './components/Layout';

import Home       from './pages/Home';
import OwnersList from './pages/OwnerSearch';
import AddOwner   from './pages/AddOwner';
import OwnerDetails from './pages/OwnerDetails';
import EditOwner  from './pages/EditOwner';

import VetList    from './pages/VetList';
import AddVet     from './pages/AddVet';
import VetDetails from './pages/VetDetails';
import EditVet    from './pages/EditVet';

import PetList    from './pages/PetsList';
import AddPet     from './pages/AddPet';
import EditPet    from './pages/EditPet';

import VisitList  from './pages/VisitList';
import AddVisit   from './pages/AddVisit';
import EditVisit  from './pages/EditVisit';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>          
          <Route index element={<Home />} />

          <Route path="owners" element={<OwnersList />} />
          <Route path="owners/add" element={<AddOwner />} />
          <Route path="owners/:id" element={<OwnerDetails />} />
          <Route path="owners/edit/:id" element={<EditOwner />} />

          <Route path="vets" element={<VetList />} />
          <Route path="vets/add" element={<AddVet />} />
          <Route path="vets/:id" element={<VetDetails />} />
          <Route path="vets/edit/:id" element={<EditVet />} />

          <Route path="pets" element={<PetList />} />
          <Route path="pets/add/:ownerId" element={<AddPet />} />
          <Route path="pets/edit/:id" element={<EditPet />} />

          <Route path="visits" element={<VisitList />} />
          <Route path="visits/add/:petId" element={<AddVisit />} />
          <Route path="visits/edit/:petId/:visitId" element={<EditVisit />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}