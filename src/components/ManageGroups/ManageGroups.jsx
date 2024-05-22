import React, { useEffect, useState } from 'react';
import './ManageGroups.scss';
import Sidebar from '../Dashboard/SideBar Section/Sidebar';
import { endpoints } from '../../api';
import { SlOptions } from 'react-icons/sl';

const ManageGroups = () => {
  const [groups, setGroups] = useState([]);
  const [managers, setManagers] = useState([]);
  const [integrators, setIntegrators] = useState([]);
  const [users, setUsers] = useState([]);
  const [userGroups, setUserGroups] = useState({});
  const [groupDetails, setGroupDetails] = useState({});
  const [newGroup, setNewGroup] = useState({
    integratorGroupName: '',
    userID: '',
  });
  const [filter, setFilter] = useState('all');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [error, setError] = useState(null);
  const [role, setRole] = useState({ isManager: false, isService: false });

  useEffect(() => {
    const fetchRoleAndData = async () => {
      const role = JSON.parse(localStorage.getItem('role'));
      setRole(role);
      if (role.isService) {
        await fetchManagers();
      }
      await fetchUsers();
      if (role.isManager) {
        await fetchGroups();
        await fetchIntegrators();
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

    const fetchUsers = async () => {
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
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.workers);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRoleAndData();
  }, []);

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

  const fetchIntegrators = async (managerID = '') => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');

      let url = endpoints.getIntegrators(userID, managerID);

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
      setIntegrators(data.integrators);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserGroups = async () => {
    try {
      const token = localStorage.getItem('id_token');
      const managerID = role.isService
        ? selectedManager
        : localStorage.getItem('userID');
      const userGroupData = {};

      for (const user of users) {
        const url = `${endpoints.getIntegratorGroups(managerID)}?groupsFor=${
          user.PK
        }`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user groups');
        }

        const data = await response.json();
        userGroupData[user.PK] = Array.isArray(data.integratorGroups)
          ? data.integratorGroups
          : [];
      }

      setUserGroups(userGroupData);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchGroupDetails = async (groupID) => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');
      let url = endpoints.getGroupDetails(userID);
      if (role.isService) {
        url += `?groups=${groupID}&groupsFor=${selectedManager}`;
      } else {
        url += `?groups=${groupID}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch group details');
      }

      const data = await response.json();

      const integratorsInGroup = data.integratorsInGroups.reduce(
        (acc, item) => {
          const key = Object.keys(item)[0];
          acc[key] = acc[key] ? [...acc[key], ...item[key]] : item[key];
          return acc;
        },
        {}
      );

      setGroupDetails((prevDetails) => ({
        ...prevDetails,
        [groupID]: integratorsInGroup[groupID] || [],
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExpandGroup = async (groupID) => {
    if (expandedGroup === groupID) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(groupID);
      await fetchGroupDetails(groupID);
      await fetchUserGroups();
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

      const updatedGroup = await response.json();
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.PK === groupID ? { ...updatedGroup } : group
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
    const managerID = e.target.value;
    setSelectedManager(managerID);
    if (managerID) {
      fetchGroups(managerID);
      fetchIntegrators(managerID);
    } else {
      setGroups([]);
      setIntegrators([]);
    }
  };

  const handleOptionSelect = (groupID, option) => {
    if (option === 'deleteGroup') {
      handleDelete(groupID);
    } else {
      setSelectedOption(option);
      setSelectedGroup(groupID);
      setSelectedItem(''); // Clear selected item when changing options
    }
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
  };

  const handleItemSubmit = async () => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');

      let payload;
      let url;
      let method;
      if (selectedOption === 'removeIntegrator') {
        payload = role.isService
          ? {
              managerID: selectedManager,
              integratorID: selectedItem,
              integratorGroupID: selectedGroup,
            }
          : {
              integratorID: selectedItem,
              integratorGroupID: selectedGroup,
            };
        url = endpoints.removeIntegratorFromGroup(userID);
        method = 'DELETE';
      } else if (selectedOption === 'removeUser') {
        payload = role.isService
          ? {
              managerID: selectedManager,
              removedUserID: selectedItem,
              integratorGroupID: selectedGroup,
            }
          : {
              removedUserID: selectedItem,
              integratorGroupID: selectedGroup,
            };
        url = endpoints.removeUserFromGroup(userID);
        method = 'DELETE';
      } else if (selectedOption === 'addIntegrator') {
        payload = role.isService
          ? {
              integratorID: selectedItem,
              integratorGroupID: selectedGroup,
              managerID: selectedManager,
            }
          : {
              integratorID: selectedItem,
              integratorGroupID: selectedGroup,
            };
        url = endpoints.addIntegratorToGroup(userID);
        method = 'POST';
      } else if (selectedOption === 'addUser') {
        payload = role.isService
          ? {
              integratorGroupID: selectedGroup,
              addedUserID: selectedItem,
              managerID: selectedManager,
            }
          : {
              integratorGroupID: selectedGroup,
              addedUserID: selectedItem,
            };
        url = endpoints.addUserToGroup(userID);
        method = 'POST';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const data = await response.json();

      if (selectedOption === 'removeIntegrator') {
        setGroupDetails((prevDetails) => ({
          ...prevDetails,
          [selectedGroup]: prevDetails[selectedGroup].map((item) =>
            item.PK === selectedItem ? { ...item, isDeleted: true } : item
          ),
        }));
      } else if (selectedOption === 'removeUser') {
        setUserGroups((prevUserGroups) => ({
          ...prevUserGroups,
          [selectedGroup]: prevUserGroups[selectedGroup].filter(
            (user) => user.PK !== selectedItem
          ),
        }));
      }

      alert('Operation successful');
    } catch (err) {
      alert('Operation failed');
      setError(err.message);
    } finally {
      setSelectedOption(null);
      setSelectedItem('');
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
              <h4 onClick={() => handleExpandGroup(group.PK)}>
                Nazwa grupy: {group.integratorGroupName}
              </h4>
              {group.isDeleted && <p>Status: Usunięty</p>}
              {expandedGroup === group.PK && (
                <div className='groupDetails'>
                  <h5>Integratory:</h5>
                  {groupDetails[group.PK] &&
                    groupDetails[group.PK]
                      .filter((integrator) => !integrator.isDeletedFromGroup)
                      .map((integrator, idx) => (
                        <p key={idx}>
                          {integrator.serialNumber}{' '}
                          {integrator.isDeleted && (
                            <span className='deletedTag'> (usunięty)</span>
                          )}
                        </p>
                      ))}
                  <h5>Użytkownicy:</h5>
                  {Object.entries(userGroups)
                    .filter(([userID, userGroup]) =>
                      userGroup.some((group) => group.PK === group.PK)
                    )
                    .map(([userID, userGroup], idx) => (
                      <p key={idx}>
                        {
                          users
                            .find((user) => user.PK === userID)
                            ?.cognitoAttributes.find(
                              (attr) => attr.Name === 'email'
                            )?.Value
                        }
                      </p>
                    ))}
                </div>
              )}
              <SlOptions
                className='icon'
                onClick={() => handleOptionSelect(group.PK, 'options')}
              />
              {selectedGroup === group.PK && selectedOption === 'options' && (
                <div className='optionsMenu'>
                  <button
                    onClick={() => handleOptionSelect(group.PK, 'deleteGroup')}
                  >
                    Usuń grupę
                  </button>
                  <button
                    onClick={() =>
                      handleOptionSelect(group.PK, 'addIntegrator')
                    }
                  >
                    Dodaj integrator
                  </button>
                  <button
                    onClick={() =>
                      handleOptionSelect(group.PK, 'removeIntegrator')
                    }
                  >
                    Usuń integrator
                  </button>
                  <button
                    onClick={() => handleOptionSelect(group.PK, 'addUser')}
                  >
                    Dodaj użytkownika
                  </button>
                  <button
                    onClick={() => handleOptionSelect(group.PK, 'removeUser')}
                  >
                    Usuń użytkownika
                  </button>
                </div>
              )}
              {selectedGroup === group.PK &&
                selectedOption &&
                selectedOption !== 'options' && (
                  <div className='selectItem'>
                    <select onChange={handleItemChange} value={selectedItem}>
                      <option value=''>Wybierz...</option>
                      {(selectedOption === 'removeIntegrator'
                        ? groupDetails[group.PK]
                        : selectedOption === 'removeUser'
                        ? users.filter((user) =>
                            userGroups[group.PK]?.some(
                              (groupUser) => groupUser.PK === user.PK
                            )
                          )
                        : selectedOption.includes('Integrator')
                        ? integrators
                        : users
                      ).map((item) => (
                        <option key={item.PK} value={item.PK}>
                          {selectedOption === 'removeIntegrator'
                            ? item.serialNumber
                            : selectedOption === 'removeUser' ||
                              selectedOption.includes('User')
                            ? getAttribute(item.cognitoAttributes, 'email')
                            : item.serialNumber}
                        </option>
                      ))}
                    </select>
                    <button onClick={handleItemSubmit} className='btn'>
                      {selectedOption.startsWith('add') ? 'Dodaj' : 'Usuń'}
                    </button>
                  </div>
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
