import React from 'react';
import './Dashboard.css';

import Top from './Body Section/Top Section/Top';
import Activity from './Body Section/Activity Section/Activity';
import Listing from './Body Section/Listing Section/Listing';
import Sidebar from './SideBar Section/Sidebar';
import Body from './Body Section/Body';
const Dashboard = () => {
  return (
    <div className='dashboard flex'>
      <Body />
    </div>
  );
};
export default Dashboard;
