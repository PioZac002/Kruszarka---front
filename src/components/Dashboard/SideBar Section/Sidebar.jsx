import './Sidebar.css';

///imported Images
import logo from '../../../assets/logoKruszarka.png';
//imported icons
import { IoMdSpeedometer } from 'react-icons/io';
import { BiSlideshow } from 'react-icons/bi';
import { MdOutlineAssignmentInd } from 'react-icons/md';
import { PiLineSegmentsBold } from 'react-icons/pi';
import { FaUserPlus } from 'react-icons/fa';
import { TbPrismPlus } from 'react-icons/tb';

const Sidebar = () => {
  return (
    <div className='sideBar grid'>
      <div className='logoDiv flex'>
        <img src={logo} alt='Image Name' className='logo' />
        <h2>KruszApp</h2>
      </div>

      <div className='menuDiv'>
        <h3 className='divTitle'>QUICK MENU</h3>
        <ul className='menuList grid'>
          <li className='listItem'>
            <a className='menuLink flex' href='#'>
              <IoMdSpeedometer className='icon' />
              <span className='smallText'>Dash board</span>
            </a>
          </li>

          <li className='listItem'>
            <a className='menuLink flex' href='#'>
              <BiSlideshow className='icon' />
              <span className='smallText'>Wyświetl kruszarki</span>
            </a>
          </li>

          <li className='listItem'>
            <a className='menuLink flex' href='#'>
              <MdOutlineAssignmentInd className='icon' />
              <span className='smallText'>Wyświetl Pracowników</span>
            </a>
          </li>

          <li className='listItem'>
            <a className='menuLink flex' href='#'>
              <PiLineSegmentsBold className='icon' />
              <span className='smallText'>Wykresy efektywności</span>
            </a>
          </li>
        </ul>
      </div>

      <div className='settingsDiv'>
        <h3 className='divTitle'>SETTINGS</h3>
        <ul className='menuList grid'>
          <li className='listItem'>
            <a className='menuLink flex' href='#'>
              <FaUserPlus className='icon' />
              <span className='smallText'>Zarządzaj pracownikami</span>
            </a>
          </li>

          <li className='listItem'>
            <a className='menuLink flex' href='#'>
              <TbPrismPlus className='icon' />
              <span className='smallText'>Zarządzaj kruszarkami</span>
            </a>
          </li>

          <li className='listItem'>
            <a className='menuLink flex' href='#'>
              <MdOutlineAssignmentInd className='icon' />
              <span className='smallText'>Wyświetl Pracowników</span>
            </a>
          </li>

          <li className='listItem'>
            <a className='menuLink flex' href='#'>
              <PiLineSegmentsBold className='icon' />
              <span className='smallText'>Wykresy efektywności</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
