import React from 'react';
import './Login.css';
import '../../App.css';
import { Link, NavLink } from 'react-router-dom';

//imports of assets
import backImg from '../../assets/backgroundaaa.png';
import logo from '../../assets/logoKruszarka.png';
import videoLogin from '../../assets/videoLogin.mp4';
//imprted Icons
import { FaUserShield } from 'react-icons/fa';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { BsFillShieldLockFill } from 'react-icons/bs';

const Login = () => {
  return (
    <div className='loginPage flex'>
      <div className='container flex'>
        <div className='videoDiv'>
          <video src={videoLogin} autoPlay muted loop></video>
          <div className='textDiv'>
            <h2 className='title'>Aplikacja do zarządzania kruszarkami</h2>
            <p>
              Aplikacja poświęcona zarządzaniu kruszarkami, ich stanem
              technicznym oraz przeglądami.
            </p>
          </div>
          <div className='footerDiv flex'>
            <span className='text'>Don't have an account?</span>
            <Link to={'/register'}>
              <button className='btn'>Sign Up</button>
            </Link>
          </div>
        </div>
        <div className='formDiv flex'>
          <div className='headerDiv'>
            <img src={logo} alt='logo' />
            <h3>Welcome Back!</h3>
          </div>

          <form action='' className='form grid'>
            <span className='showMessage'>Login status will go here</span>
            <div className='inputDiv'>
              <label htmlFor='username'>Username</label>
              <div className='input flex'>
                <FaUserShield className='icon' />
                <input type='text' id='username' placeholder='Enter username' />
              </div>
            </div>
            <div className='inputDiv'>
              <label htmlFor='password'>Password</label>
              <div className='input flex'>
                <BsFillShieldLockFill className='icon' />
                <input
                  type='password'
                  id='password'
                  placeholder='Enter password'
                />
              </div>
            </div>

            <button type='submit' className='btn flex'>
              <span>Login</span>
              <AiOutlineSwapRight className='icon' />
            </button>
            <a href='/dashboard'>Dashboiard</a>
            <span className='forgotPassword'>
              Forgot your password? <a href=''>Click here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
