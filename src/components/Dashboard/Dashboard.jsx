import React from 'react';
import './Dashboard.css';

import Top from './Body Section/Top Section/Top';
import Activity from './Body Section/Activity Section/Activity';
import Listing from './Body Section/Listing Section/Listing';
import Sidebar from './SideBar Section/Sidebar';
import Body from './Body Section/Body';
const Dashboard = () => {
  const role = JSON.parse(localStorage.getItem('role'));
  const { isManager, isService } = role;

  return (
    <div className='container'>
      <Sidebar />
      <div className='mainContent'>
        <Top />
        <div className='bottom flex'>
          {isManager && <Listing />}
          {isService && <Activity />}
          {!isManager && !isService && (
            <p>
              Jesteś zwykłym pracownikiem. Nie masz uprawnień do zarządzania
              kruszarkami ani pracownikami.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
