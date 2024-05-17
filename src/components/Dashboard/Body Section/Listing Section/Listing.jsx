import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Listing.css';
// imported icons
import { HiOutlineArrowLongRight } from 'react-icons/hi2';
// imported images
import crusherImage from '../../../../assets/kruszarkalol.png';
import userImage from '../../../../assets/guyImage.png';
import { endpoints } from '../../../../api'; // Importuj named exports

const Listing = () => {
  const [workers, setWorkers] = useState([]);
  const [integrators, setIntegrators] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
        console.log('Workers data:', data.workers);
        setWorkers(data.workers);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchIntegrators = async () => {
      try {
        const userID = localStorage.getItem('userID');
        const token = localStorage.getItem('id_token');
        const role = localStorage.getItem('role'); // Pobierz rolę użytkownika z localStorage
        const managerID = localStorage.getItem('managerID'); // Pobierz managerID jeśli istnieje

        const url =
          role === 'serviceman' && managerID
            ? endpoints.getIntegrators(userID, managerID)
            : endpoints.getIntegrators(userID);

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
        console.log('Integrators data:', data.integrators);
        setIntegrators(data.integrators);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWorkers();
    fetchIntegrators();
  }, []);

  const getAttribute = (attributes = [], name) => {
    const attribute = attributes.find((attr) => attr.Name === name);
    return attribute ? attribute.Value : 'N/A';
  };

  return (
    <div className='listingSection'>
      {error && <div className='error'>{error}</div>}

      <div className='heading flex'>
        <h1>Lista kruszarek</h1>
        <button
          className='btn flex'
          onClick={() => navigate('/manage-integrators')}
        >
          Zarządzaj <HiOutlineArrowLongRight className='icon' />
        </button>
      </div>
      <div className='secContainer flex'>
        {Array.isArray(integrators) && integrators.length > 0 ? (
          integrators.map((integrator, index) => (
            <div className='singleItem' key={index}>
              <img src={crusherImage} alt='Integrator' />
              <h3>Lokalizacja: </h3> <small>{integrator.location}</small>
              <h3>Numer seryjny: </h3> <small>{integrator.serialNumber}</small>
            </div>
          ))
        ) : (
          <p>Brak integratorów do wyświetlenia.</p>
        )}
      </div>

      <div className='heading flex'>
        <h1>Lista pracowników</h1>
        <button
          className='btn flex'
          onClick={() => navigate('/manage-workers')}
        >
          Zarządzaj <HiOutlineArrowLongRight className='icon' />
        </button>
      </div>
      <div className='secContainer flex'>
        {Array.isArray(workers) && workers.length > 0 ? (
          workers.map((worker, index) => (
            <div className='singleItem' key={index}>
              <h3>
                {getAttribute(worker.cognitoAttributes, 'given_name')}{' '}
                {getAttribute(worker.cognitoAttributes, 'family_name')}
              </h3>
              <p>{getAttribute(worker.cognitoAttributes, 'email')}</p>
            </div>
          ))
        ) : (
          <p>Brak pracowników do wyświetlenia.</p>
        )}
      </div>
    </div>
  );
};

export default Listing;
