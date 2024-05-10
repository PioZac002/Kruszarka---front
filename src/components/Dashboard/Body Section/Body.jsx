import './Body.css';
import Sidebar from '../SideBar Section/Sidebar';
import Listing from './Listing Section/Listing';
import Activity from './Activity Section/Activity';
import Top from './Top Section/Top';
const Body = () => {
  return (
    <div className='mainContent'>
      <Top />
      <div className='bottom flex'>
        <Listing />
        <Activity />
      </div>
    </div>
  );
};
export default Body;
