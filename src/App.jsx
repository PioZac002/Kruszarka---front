// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IntegratorsPage from './pages/IntegratorsPage';
import IntegratorGroupsPage from './pages/IntegratorsGroupsPage';
import UserProfilePage from './pages/UserProfilePage';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route
          path='/dashboard'
          element={
            <>
              <Navbar />
              <DashboardPage />
            </>
          }
        />
        <Route
          path='/integrators'
          element={
            <>
              <Navbar />
              <IntegratorsPage />
            </>
          }
        />
        <Route
          path='/integrator-groups'
          element={
            <>
              <Navbar />
              <IntegratorGroupsPage />
            </>
          }
        />
        <Route
          path='/profile'
          element={
            <>
              <Navbar />
              <UserProfilePage />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
