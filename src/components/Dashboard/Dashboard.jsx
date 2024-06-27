import React from 'react';
import './Dashboard.css';

import Top from './Body Section/Top Section/Top';
import Activity from './Body Section/Activity Section/Activity';
import Listing from './Body Section/Listing Section/Listing';
import Sidebar from './SideBar Section/Sidebar';
import Body from './Body Section/Body';

const Dashboard = () => {
  const role = localStorage.getItem('role')
    ? JSON.parse(localStorage.getItem('role'))
    : {};
  const { isManager, isService } = role;

  return (
    <div className='container'>
      {(isManager || isService) && <Sidebar />}
      <div className='mainContent'>
        {/* {(isManager || isService) && <Top />} */}
        <div className='bottom flex'>
          <Listing />
          {(isManager || isService) && <Activity />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
