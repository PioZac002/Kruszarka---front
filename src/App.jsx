// App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ManageIntegrators from './components/ManageIntegrators/ManageIntegrators';
import ManageWorkers from './components/ManageWorkers/ManageWorkers';
import ManageGroups from './components/ManageGroups/ManageGroups';
import Diagrams from './components/Diagrams/Diagrams';
import './App.scss';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/manage-integrators',
    element: <ManageIntegrators />,
  },
  {
    path: '/manage-workers',
    element: <ManageWorkers />,
  },
  {
    path: '/manage-groups',
    element: <ManageGroups />,
  },
  {
    path: '/diagrams',
    element: <Diagrams />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
