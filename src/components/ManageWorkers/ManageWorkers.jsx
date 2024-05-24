import React, { useEffect, useState } from 'react';
import './ManageWorkers.scss';
import Sidebar from '../Dashboard/SideBar Section/Sidebar';
import { endpoints } from '../../api';

const ManageWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [newWorker, setNewWorker] = useState({
    email: '',
    given_name: '',
    family_name: '',
    role: {
      isService: false,
      isManager: false,
    },
    manager: '',
  });
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [role, setRole] = useState({ isManager: false, isService: false });

  useEffect(() => {
    const fetchRole = () => {
      const role = JSON.parse(localStorage.getItem('role'));
      setRole(role);
    };

    const fetchWorkers = async () => {
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
        setWorkers(data.workers);
        setManagers(data.workers.filter((worker) => worker.role.isManager));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRole();
    fetchWorkers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWorker((prevWorker) => ({
      ...prevWorker,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    setNewWorker((prevWorker) => ({
      ...prevWorker,
      role: {
        ...prevWorker.role,
        [name]: checked,
        ...(name === 'isService' && checked ? { isManager: false } : {}),
        ...(name === 'isManager' && checked ? { isService: false } : {}),
      },
      manager:
        name === 'isManager' || name === 'isService' ? '' : prevWorker.manager,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');
      const isService = role.isService;

      const payload = {
        username: newWorker.email,
        userAttributes: [
          { Name: 'email', Value: newWorker.email },
          { Name: 'given_name', Value: newWorker.given_name },
          { Name: 'family_name', Value: newWorker.family_name },
        ],
        role: newWorker.role,
        manager: role.isManager
          ? userID
          : !newWorker.role.isService && !newWorker.role.isManager
          ? newWorker.manager
          : undefined,
      };

      const response = await fetch(endpoints.register(userID), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create worker');
      }

      const data = await response.json();
      setWorkers((prevWorkers) => [...prevWorkers, data]);
      setNewWorker({
        email: '',
        given_name: '',
        family_name: '',
        role: {
          isService: false,
          isManager: false,
        },
        manager: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (workerID) => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');

      const payload = {
        userID: workerID,
        editData: {
          isDeleted: true,
        },
      };

      const response = await fetch(endpoints.editWorker(userID), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to delete worker');
      }

      setWorkers((prevWorkers) =>
        prevWorkers.map((worker) =>
          worker.PK === workerID ? { ...worker, isDeleted: true } : worker
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredWorkers = workers.filter((worker) => {
    if (filter === 'active') return !worker.isDeleted;
    if (filter === 'deleted') return worker.isDeleted;
    return true;
  });

  return (
    <div className='manageWorkersContainer'>
      <Sidebar className='sidebar' />
      <div className='manageSection'>
        <div className='header'>
          <h1>Zarządzaj pracownikami</h1>
          <p>Dodawanie i usuwanie pracowników</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type='email'
                name='email'
                value={newWorker.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Imię:</label>
              <input
                type='text'
                name='given_name'
                value={newWorker.given_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Nazwisko:</label>
              <input
                type='text'
                name='family_name'
                value={newWorker.family_name}
                onChange={handleChange}
                required
              />
            </div>
            {role.isService && (
              <div>
                <label>Rola:</label>
                <div>
                  <label>
                    <input
                      type='checkbox'
                      name='isService'
                      checked={newWorker.role.isService}
                      onChange={handleRoleChange}
                      disabled={newWorker.role.isManager}
                    />
                    Serwisant
                  </label>
                  <label>
                    <input
                      type='checkbox'
                      name='isManager'
                      checked={newWorker.role.isManager}
                      onChange={handleRoleChange}
                      disabled={newWorker.role.isService}
                    />
                    Manager
                  </label>
                </div>
              </div>
            )}
            {role.isService &&
              !newWorker.role.isService &&
              !newWorker.role.isManager && (
                <div>
                  <label>Manager:</label>
                  <select
                    name='manager'
                    value={newWorker.manager}
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
              Dodaj pracownika
            </button>
          </form>
          <div className='filterContainer'>
            <h3>Lista pracowników</h3>
            <label>Filtruj: </label>
            <select value={filter} onChange={handleFilterChange}>
              <option value='all'>Wszyscy</option>
              <option value='active'>Aktywni</option>
              <option value='deleted'>Usunięci</option>
            </select>
          </div>
        </div>
        <div className='secContainer'>
          {filteredWorkers.map((worker, index) => (
            <div key={index} className='singleItem'>
              <h4>
                {getAttribute(worker.cognitoAttributes, 'given_name')}{' '}
                {getAttribute(worker.cognitoAttributes, 'family_name')}
              </h4>
              <p>
                <small>{getAttribute(worker.cognitoAttributes, 'email')}</small>
              </p>
              {!worker.isDeleted && (
                <button onClick={() => handleDelete(worker.PK)} className='btn'>
                  Usuń pracownika
                </button>
              )}
              {worker.isDeleted && <p>Status: Usunięty</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageWorkers;

function getAttribute(attributes, name) {
  if (!Array.isArray(attributes)) {
    return 'N/A';
  }
  const attribute = attributes.find((attr) => attr.Name === name);
  return attribute ? attribute.Value : 'N/A';
}
