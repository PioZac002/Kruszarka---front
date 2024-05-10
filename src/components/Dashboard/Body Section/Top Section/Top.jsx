import './Top.css';
//imported images
import video from '../../../../assets/videoLogin.mp4';
import toolsImage from '../../../../assets/toolsImage.png';
//imported icons
import { IoSearch } from 'react-icons/io5';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { IoMdNotificationsOutline } from 'react-icons/io';
import adminImage from '../../../../assets/guyImage.png';
import { HiOutlineArrowLongRight } from 'react-icons/hi2';
import { FaRegQuestionCircle } from 'react-icons/fa';
const Top = () => {
  return (
    <div className='topSection'>
      <div className='headerSection flex'>
        <div className='title'>
          <h1>Welcome</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Consequatur, ipsam veritatis? Fugit eligendi distinctio reiciendis
            dolorum ratione consequuntur id doloremque?
          </p>
        </div>
        <div className='searchBar flex'>
          <input type='text' placeholder='Search Dashboard' />
          <IoSearch className='icon' />
        </div>
        <div className='adminDiv flex'>
          <BiMessageRoundedDetail className='icon' />
          <IoMdNotificationsOutline className='icon' />
          <div className='adminImage'>
            <img src={adminImage} alt='Admin Image' />
          </div>
        </div>
      </div>

      <div className='cardSection flex'>
        <div className='rightCard flex'>
          <h1>Zarzadzaj kruszarkami bla bla</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore,
            minus tenetur. Libero illo qui ipsam.
          </p>
          <div className='buttons flex'>
            <button className='btn'>Explore more</button>
            <button className='btn transparent'>Moje kruszarki</button>
          </div>

          <div className='videoDiv'>
            <video src={video} autoPlay loop muted></video>
          </div>
        </div>
        <div className='leftCard flex'>
          <div className='main flex'>
            <div className='textDiv'>
              <h1>Moje kruszarki</h1>
              <div className='flex'>
                <span>
                  Przypisane:
                  <br /> <small>4 kruszarki</small>
                </span>
                <span>
                  Przypisane:
                  <br /> <small>4 kruszarki</small>
                </span>
              </div>
              <span className='flex link'>
                Idź do kruszarek
                <HiOutlineArrowLongRight className='icon' />
              </span>
            </div>

            <div className='imgDiv'>
              <img src={toolsImage} alt='BackGround Image' />
            </div>
            {/* moze potem sie przyda  */}
            {/* <div className='sideBarCard'>
              <FaRegQuestionCircle className='icon' />
              <div className='cardContent'>
                <div className='circle1'></div>
                <div className='circle2'></div>
                <h3>Help Center</h3>
                <p>Having problems? Contact us here:</p>
                <button className='btn'>Go to help center</button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Top;
