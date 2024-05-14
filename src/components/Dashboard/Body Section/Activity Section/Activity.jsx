import './Activity.css';
//imported icons
import { HiOutlineArrowLongRight } from 'react-icons/hi2';
//imported images
import crusherImage from '../../../../assets/kruszarkalol.png';
import userImage from '../../../../assets/guyImage.png';

const Activity = () => {
  return (
    <div className='activitySection'>
      <div className='heading flex'>
        <h1>Lista grup</h1>
        <button className='btn flex'>
          See All
          <HiOutlineArrowLongRight className='icon' />
        </button>
      </div>
      <div className='secContainer grid'>
        <div className='singleCustomer flex'>
          <img src={userImage} alt='' />
          <div className='customerDetails'>
            <span className='name'>Grupa pierwsza</span>
            <small>bla bla bla</small>
          </div>
          <div className='duration'>Pogchamp</div>
        </div>
        <div className='singleCustomer flex'>
          <img src={userImage} alt='' />
          <div className='customerDetails'>
            <span className='name'>Grupa pierwsza</span>
            <small>bla bla bla</small>
          </div>
          <div className='duration'>Pogchamp</div>
        </div>
        <div className='singleCustomer flex'>
          <img src={userImage} alt='' />
          <div className='customerDetails'>
            <span className='name'>Grupa pierwsza</span>
            <small>bla bla bla</small>
          </div>
          <div className='duration'>Pogchamp</div>
        </div>
        <div className='singleCustomer flex'>
          <img src={userImage} alt='' />
          <div className='customerDetails'>
            <span className='name'>Grupa pierwsza</span>
            <small>bla bla bla</small>
          </div>
          <div className='duration'>Pogchamp</div>
        </div>
      </div>
    </div>
  );
};
export default Activity;
