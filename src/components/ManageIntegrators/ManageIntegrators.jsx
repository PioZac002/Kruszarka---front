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
  const [selectedManager, setSelectedManager] = useState('');
  const [filter, setFilter] = useState('all');
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

        let url = endpoints.getIntegrators(userID);
        if (role.isManager) {
          url += `?createdFor=${userID}`;
        } else if (role.isService && selectedManager) {
          url += `?createdFor=${selectedManager}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch integrators');
        }

        const data = await response.json();
        setIntegrators(Array.isArray(data.integrators) ? data.integrators : []);
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
    if (role.isService) {
      fetchManagers();
    }
    fetchIntegrators();
  }, [role.isService, selectedManager]);

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

      const response = await fetch(endpoints.addIntegrator(userID), {
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

  const handleDelete = async (integratorID) => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');

      const payload = {
        userID: selectedManager,
        editData: {
          isDeleted: true,
          PK: integratorID,
        },
      };

      const response = await fetch(endpoints.editIntegrator(userID), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to delete integrator');
      }

      const updatedIntegrator = await response.json();
      setIntegrators((prevIntegrators) =>
        prevIntegrators.map((integrator) =>
          integrator.PK === integratorID
            ? { ...integrator, ...updatedIntegrator }
            : integrator
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleManagerChange = (e) => {
    setSelectedManager(e.target.value);
    if (e.target.value) {
      fetchIntegrators(e.target.value);
    }
  };

  const filteredIntegrators = integrators.filter((integrator) => {
    if (filter === 'active') return !integrator.isDeleted;
    if (filter === 'deleted') return integrator.isDeleted;
    return true;
  });

  const getAttribute = (attributes = [], name) => {
    const attribute = attributes.find((attr) => attr.Name === name);
    return attribute ? attribute.Value : 'N/A';
  };

  return (
    <div className='manageIntegratorsContainer'>
      <Sidebar className='sidebar' />
      <div className='manageSection'>
        <div className='header'>
          <h1>Zarządzaj integratorami</h1>
          <p>Dodawanie i usuwanie integratorów</p>
          <form onSubmit={handleSubmit} className='formContainer'>
            <div className='formRow'>
              <label>Lokacja:</label>
              <input
                type='text'
                name='location'
                value={newIntegrator.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className='formRow'>
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
              <div className='formRow'>
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
          <div className='filterManagerContainer'>
            <div className='filterContainer'>
              <label>Filtruj: </label>
              <select value={filter} onChange={handleFilterChange}>
                <option value='all'>Wszystkie</option>
                <option value='active'>Aktywne</option>
                <option value='deleted'>Usunięte</option>
              </select>
            </div>
            {role.isService && (
              <div className='managerSelect'>
                <label htmlFor='manager'>Wybierz managera: </label>
                <select
                  id='manager'
                  value={selectedManager}
                  onChange={handleManagerChange}
                >
                  <option value=''>Wybierz...</option>
                  {managers.map((manager) => (
                    <option key={manager.PK} value={manager.PK}>
                      {getAttribute(manager.cognitoAttributes, 'given_name')}{' '}
                      {getAttribute(manager.cognitoAttributes, 'family_name')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <div className='secContainer'>
          {filteredIntegrators.map((integrator, index) => (
            <div key={index} className='singleItem'>
              <h4>Lokacja: {integrator.location}</h4>
              <p>Numer seryjny: {integrator.serialNumber}</p>
              {integrator.isDeleted && <p>Status: Usunięty</p>}
              {!integrator.isDeleted && (
                <button
                  onClick={() => handleDelete(integrator.PK)}
                  className='btn'
                >
                  Usuń integrator
                </button>
              )}
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
