import './Listing.css';
//imported icons
import { HiOutlineArrowLongRight } from 'react-icons/hi2';
import { PiHeartFill } from 'react-icons/pi';

//imported images
import crusherImage from '../../../../assets/kruszarkalol.png';
import userImage from '../../../../assets/guyImage.png';

const Listing = () => {
  return (
    <div className='listingSection'>
      <div className='heading flex'>
        <h1>Lista kruszarek</h1>
        <button className='btn flex'>
          See all <HiOutlineArrowLongRight className='icon' />
        </button>
      </div>
      <div className='secContainer flex'>
        <div className='singleItem'>
          <img src={crusherImage} alt='image' />
          <h3>Kruszarka1</h3>
        </div>

        <div className='singleItem'>
          <img src={crusherImage} alt='image' />
          <h3>Kruszarka2</h3>
        </div>

        <div className='singleItem'>
          <img src={crusherImage} alt='image' />
          <h3>Kruszarka3</h3>
        </div>

        <div className='singleItem'>
          <img src={crusherImage} alt='image' />
          <h3>Kruszarka4</h3>
        </div>
      </div>

      {/* <div className='sellers flex'>
        <div className='topSellers'>
          <div className='heading flex'>
            <h3>Top Workers</h3>
            <button className='btn flex'>
              See All <HiOutlineArrowLongRight className='icon' />
            </button>
          </div>

          <div className='card flex'>
            <div className='users'>
              <img src={userImage} alt='userImage' />
              <img src={userImage} alt='userImage' />
              <img src={userImage} alt='userImage' />
              <img src={userImage} alt='userImage' />
            </div>
            <div className='cardText'>
              <span>
                bla bla bla bla <small>bla bla </small>
              </span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default Listing;
