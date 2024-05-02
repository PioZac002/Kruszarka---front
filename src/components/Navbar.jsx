// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/dashboard'>Dashboard</Link>
        </li>
        <li>
          <Link to='/integrators'>Integrators</Link>
        </li>
        <li>
          <Link to='/integrator-groups'>Integrator Groups</Link>
        </li>
        <li>
          <Link to='/profile'>Profile</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
