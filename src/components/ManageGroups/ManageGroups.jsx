import React, { useEffect, useState } from 'react';
import './ManageGroups.scss';
import Sidebar from '../Dashboard/SideBar Section/Sidebar';
import { endpoints } from '../../api';

const ManageGroups = () => {
  const [groups, setGroups] = useState([]);
  const [managers, setManagers] = useState([]);
  const [newGroup, setNewGroup] = useState({
    integratorGroupName: '',
    userID: '',
  });
  const [filter, setFilter] = useState('all');
  const [selectedManager, setSelectedManager] = useState('');
  const [error, setError] = useState(null);
  const [role, setRole] = useState({ isManager: false, isService: false });

  useEffect(() => {
    const fetchRole = () => {
      const role = JSON.parse(localStorage.getItem('role'));
      setRole(role);
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
  }, []);

  useEffect(() => {
    if (role.isManager) {
      fetchGroups();
    }
  }, [role.isManager]);

  const fetchGroups = async (managerID = '') => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');

      let url = endpoints.getIntegratorGroups(userID);
      if (role.isService && managerID) {
        url += `?groupsFor=${managerID}`;
      } else if (role.isManager) {
        url += `?groupsFor=${userID}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }

      const data = await response.json();
      setGroups(
        Array.isArray(data.integratorGroups) ? data.integratorGroups : []
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGroup((prevGroup) => ({
      ...prevGroup,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');

      const payload = role.isService
        ? {
            userID: newGroup.userID,
            integratorGroupName: newGroup.integratorGroupName,
          }
        : {
            integratorGroupName: newGroup.integratorGroupName,
          };

      const response = await fetch(endpoints.addGroup(userID), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const data = await response.json();
      setGroups((prevGroups) => [...prevGroups, data]);
      setNewGroup({
        integratorGroupName: '',
        userID: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (groupID) => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');

      const payload = {
        userID: role.isService ? selectedManager : userID,
        editData: {
          isDeleted: true,
          PK: groupID,
        },
      };

      const response = await fetch(endpoints.editGroup(userID), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to delete group');
      }

      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.PK === groupID ? { ...group, isDeleted: true } : group
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
      fetchGroups(e.target.value);
    } else {
      setGroups([]);
    }
  };

  const filteredGroups = groups.filter((group) => {
    if (filter === 'active') return !group.isDeleted;
    if (filter === 'deleted') return group.isDeleted;
    return true;
  });

  return (
    <div className='manageGroupsContainer'>
      <Sidebar className='sidebar' />
      <div className='manageSection'>
        <div className='header'>
          <h1>Zarządzaj grupami</h1>
          <p>Dodawanie i usuwanie grup</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Nazwa grupy:</label>
              <input
                type='text'
                name='integratorGroupName'
                value={newGroup.integratorGroupName}
                onChange={handleChange}
                required
              />
            </div>
            {role.isService && (
              <div>
                <label>Manager:</label>
                <select
                  name='userID'
                  value={newGroup.userID}
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
              Dodaj grupę
            </button>
          </form>
          <div className='filterContainer'>
            <label>Filtruj: </label>
            <select value={filter} onChange={handleFilterChange}>
              <option value='all'>Wszystkie</option>
              <option value='active'>Aktywne</option>
              <option value='deleted'>Usunięte</option>
            </select>
          </div>
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
        <div className='secContainer'>
          {filteredGroups.map((group, index) => (
            <div key={index} className='singleItem'>
              <h4>Nazwa grupy: {group.integratorGroupName}</h4>
              {group.isDeleted && <p>Status: Usunięty</p>}
              {!group.isDeleted && (
                <button onClick={() => handleDelete(group.PK)} className='btn'>
                  Usuń grupę
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageGroups;

function getAttribute(attributes, name) {
  if (!Array.isArray(attributes)) {
    return 'N/A';
  }
  const attribute = attributes.find((attr) => attr.Name === name);
  return attribute ? attribute.Value : 'N/A';
}
