import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Activity.css';
import { HiOutlineArrowLongRight } from 'react-icons/hi2';
import userImage from '../../../../assets/guyImage.png';
import { endpoints } from '../../../../api';

const Activity = () => {
  const [groups, setGroups] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const role = JSON.parse(localStorage.getItem('role'));

  useEffect(() => {
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

    if (role.isService) {
      fetchManagers();
    }

    const fetchGroups = async () => {
      try {
        const userID = localStorage.getItem('userID');
        const token = localStorage.getItem('id_token');

        let url = endpoints.getIntegratorGroups(userID);
        if (role.isManager) {
          url += `?groupsFor=${userID}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch groups: ${response.statusText}`);
        }

        const data = await response.json();
        setGroups(data.integratorGroups);
      } catch (err) {
        setError(err.message);
      }
    };

    if (!role.isService) {
      fetchGroups();
    }
  }, [role.isManager, role.isService]);

  const fetchGroupsForManager = async (managerID) => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');

      let url = endpoints.getIntegratorGroups(userID);
      if (role.isService) {
        url += `?groupsFor=${managerID}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.statusText}`);
      }

      const data = await response.json();
      setGroups(data.integratorGroups);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleManagerChange = (e) => {
    setSelectedManager(e.target.value);
    if (e.target.value) {
      fetchGroupsForManager(e.target.value);
    } else {
      setGroups([]);
    }
  };

  const getAttribute = (attributes = [], name) => {
    const attribute = attributes.find((attr) => attr.Name === name);
    return attribute ? attribute.Value : 'N/A';
  };

  return (
    <div className='activitySection'>
      {error && <div className='error'>{error}</div>}

      <div className='heading flex'>
        <h1>Lista grup</h1>
        <button className='btn flex' onClick={() => navigate('/manage-groups')}>
          See All
          <HiOutlineArrowLongRight className='icon' />
        </button>
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

      <div className='secContainer grid'>
        {Array.isArray(groups) && groups.length > 0 ? (
          groups.map((group, index) => (
            <div className='singleCustomer flex' key={index}>
              <img src={userImage} alt='Group' />
              <div className='customerDetails'>
                <span className='name'>{group.integratorGroupName}</span>
              </div>
            </div>
          ))
        ) : (
          <p>Brak grup do wyświetlenia.</p>
        )}
      </div>
    </div>
  );
};

export default Activity;
