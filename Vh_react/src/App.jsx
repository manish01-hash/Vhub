import { useEffect, useState } from 'react';

import CreateVolunteer from './components/volunteers/CreateVolunteer';
import DeleteVolunteer from './components/volunteers/DeleteVolunteer';
import UpdateVolunteer from './components/volunteers/UpdateVolunteer';
import CreateEvent from './components/events/CreateEvent';
import ViewEvents from './components/events/ViewEvents';
import ViewAll from './components/volunteers/ViewAll';
import AdminDashboard from './pages/AdminDashboard';


function App() {
 
  return (
   <AdminDashboard/>
  );
}

export default App;