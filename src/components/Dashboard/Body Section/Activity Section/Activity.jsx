import React, { useEffect, useState } from 'react';
import './Activity.css';
// imported icons
import { HiOutlineArrowLongRight } from 'react-icons/hi2';
// imported images
import userImage from '../../../../assets/guyImage.png';
import { endpoints } from '../../../../api'; // Importuj named exports

const Activity = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userID = localStorage.getItem('userID');
        const token = localStorage.getItem('id_token');
        const role = localStorage.getItem('role'); // Pobierz rolę użytkownika z localStorage
        const groupsFor = localStorage.getItem('groupsFor'); // Pobierz groupsFor jeśli istnieje

        // Ustal właściwą ścieżkę na podstawie roli użytkownika
        const url =
          role === 'manager' || (role === 'serviceman' && groupsFor)
            ? `${endpoints.getIntegratorGroups(userID)}?groupsFor=${groupsFor}`
            : endpoints.getIntegratorGroups(userID);

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
        console.log('Groups data:', data.integratorGroups); // Dostosowano do struktury odpowiedzi
        setGroups(data.integratorGroups); // Ustaw odpowiednią tablicę grup
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className='activitySection'>
      {error && <div className='error'>{error}</div>}

      <div className='heading flex'>
        <h1>Lista grup</h1>
        <button className='btn flex'>
          See All
          <HiOutlineArrowLongRight className='icon' />
        </button>
      </div>
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
