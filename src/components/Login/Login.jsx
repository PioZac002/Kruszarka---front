import React, { useState } from 'react';
import './Login.css';
import '../../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { endpoints } from '../../api'; // Importuj named exports

// imports of assets
import backImg from '../../assets/backgroundaaa.png';
import logo from '../../assets/logoKruszarka.png';
import videoLogin from '../../assets/videoLogin.mp4';
// imported Icons
import { FaUserShield } from 'react-icons/fa';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { BsFillShieldLockFill } from 'react-icons/bs';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(endpoints.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.challengeName === 'NEW_PASSWORD_REQUIRED') {
        const { USER_ID_FOR_SRP } = data.challengeParameters;
        const { session } = data;
        // Przekierowanie na stronę zmiany hasła z odpowiednimi parametrami
        navigate(`/register?username=${USER_ID_FOR_SRP}&session=${session}`);
      } else {
        const { access_token, id_token, userID } = data;
        // Zapisz tokeny i ID użytkownika w local storage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('id_token', id_token);
        localStorage.setItem('userID', userID);

        // Pobierz dane użytkownika
        const fetchUserResponse = await fetch(
          endpoints.getUser(userID, userID),
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${id_token}`,
            },
          }
        );

        if (!fetchUserResponse.ok) {
          throw new Error('Nie udało się pobrać danych użytkownika');
        }

        const userData = await fetchUserResponse.json();
        localStorage.setItem('role', JSON.stringify(userData.user.role));

        // Przekierowanie do dashboardu
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        'Logowanie nie powiodło się. Sprawdź swoje dane i spróbuj ponownie.'
      );
    }
  };

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
          {/* <div className='footerDiv flex'>
            <span className='text'>Nie masz konta?</span>
            <Link to={'/register'}>
              <button className='btn'>Zarejestruj się</button>
            </Link>
          </div> */}
        </div>
        <div className='formDiv flex'>
          <div className='headerDiv'>
            <img src={logo} alt='logo' />
            <h3>Witaj ponownie!</h3>
          </div>

          <form className='form grid' onSubmit={handleSubmit}>
            {error && <span className='showMessage'>{error}</span>}
            <div className='inputDiv'>
              <label htmlFor='username'>Email</label>
              <div className='input flex'>
                <FaUserShield className='icon' />
                <input
                  type='email'
                  id='username'
                  placeholder='Wprowadź nazwę użytkownika'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className='inputDiv'>
              <label htmlFor='password'>Hasło</label>
              <div className='input flex'>
                <BsFillShieldLockFill className='icon' />
                <input
                  type='password'
                  id='password'
                  placeholder='Wprowadź hasło'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type='submit' className='btn flex'>
              <span>Zaloguj się</span>
              <AiOutlineSwapRight className='icon' />
            </button>
            {/* <span className='forgotPassword'>
              Zapomniałeś hasła? <a href=''>Kliknij tutaj</a>
            </span> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
