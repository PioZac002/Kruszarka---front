// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className='content'>{children}</div>
    </div>
  );
}

export default Layout;
