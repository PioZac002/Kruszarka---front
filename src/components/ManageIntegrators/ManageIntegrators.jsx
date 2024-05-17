import React, { useEffect, useState } from 'react';
import './ManageIntegrators.scss';
import Sidebar from '../Dashboard/SideBar Section/Sidebar';
import { endpoints } from '../../api';

const ManageIntegrators = () => {
  const [integrators, setIntegrators] = useState([]);
  const [managers, setManagers] = useState([]);
  const [newIntegrator, setNewIntegrator] = useState({
    location: '',
    serialNumber: '',
    userID: '',
  });
  const [error, setError] = useState(null);
  const [role, setRole] = useState({ isManager: false, isService: false });

  useEffect(() => {
    const fetchRole = () => {
      const role = JSON.parse(localStorage.getItem('role'));
      setRole(role);
    };

    const fetchIntegrators = async () => {
      try {
        const userID = localStorage.getItem('userID');
        const token = localStorage.getItem('id_token');

        const response = await fetch(endpoints.getIntegrators(userID), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch integrators');
        }

        const data = await response.json();
        setIntegrators(data.integrators);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchManagers = async () => {
      try {
        const userID = localStorage.getItem('userID');
        const token = localStorage.getItem('id_token');

        const response = await fetch(endpoints.getWorkers(userID), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch workers');
        }

        const data = await response.json();
        setManagers(data.workers.filter((worker) => worker.role.isManager));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRole();
    fetchIntegrators();
    if (role.isService) {
      fetchManagers();
    }
  }, [role.isService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewIntegrator((prevIntegrator) => ({
      ...prevIntegrator,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');

      const payload = {
        userID: role.isService ? newIntegrator.userID : userID,
        location: newIntegrator.location,
        serialNumber: newIntegrator.serialNumber,
      };

      const response = await fetch(endpoints.createIntegrator(userID), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create integrator');
      }

      const data = await response.json();
      setIntegrators((prevIntegrators) => [...prevIntegrators, data]);
      setNewIntegrator({
        location: '',
        serialNumber: '',
        userID: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='manageIntegratorsContainer'>
      <Sidebar className='sidebar' />
      <div className='manageSection'>
        <div className='header'>
          <h1>Zarządzaj integratorami</h1>
          <p>Dodawanie i usuwanie integratorów</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Lokacja:</label>
              <input
                type='text'
                name='location'
                value={newIntegrator.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Numer Seryjny:</label>
              <input
                type='text'
                name='serialNumber'
                value={newIntegrator.serialNumber}
                onChange={handleChange}
                required
              />
            </div>
            {role.isService && (
              <div>
                <label>Manager:</label>
                <select
                  name='userID'
                  value={newIntegrator.userID}
                  onChange={handleChange}
                  required
                >
                  <option value=''>Wybierz managera</option>
                  {managers.map((manager) => (
                    <option key={manager.PK} value={manager.PK}>
                      {getAttribute(manager.cognitoAttributes, 'given_name')}{' '}
                      {getAttribute(manager.cognitoAttributes, 'family_name')}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button type='submit' className='btn'>
              Dodaj integrator
            </button>
          </form>
        </div>
        <div className='secContainer'>
          {integrators.map((integrator, index) => (
            <div key={index} className='singleItem'>
              <h4>Lokacja: {integrator.location}</h4>
              <p>Numer seryjny: {integrator.serialNumber}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageIntegrators;

function getAttribute(attributes, name) {
  if (!Array.isArray(attributes)) {
    return 'N/A';
  }
  const attribute = attributes.find((attr) => attr.Name === name);
  return attribute ? attribute.Value : 'N/A';
}
