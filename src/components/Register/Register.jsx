import React, { useState } from 'react';
import './Register.css';
import '../../App.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { endpoints } from '../../api'; // Importuj named exports

// imports of assets
import backImg from '../../assets/backgroundaaa.png';
import logo from '../../assets/logoKruszarka.png';
import videoLogin from '../../assets/videoLogin.mp4';
// imported Icons
import { FaUserShield } from 'react-icons/fa';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { BsFillShieldLockFill } from 'react-icons/bs';

const Register = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const username = query.get('username');
  const session = query.get('session');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Hasła nie są zgodne');
      return;
    }

    try {
      const response = await fetch(endpoints.firstLogin(username), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: newPassword, session }),
      });
      const data = await response.json();
      if (response.ok) {
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
      } else {
        setError('Nie udało się zmienić hasła. Spróbuj ponownie.');
      }
    } catch (err) {
      setError('Nie udało się zmienić hasła. Spróbuj ponownie.');
    }
  };

  return (
    <div className='registerPage flex'>
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
            <span className='text'>Masz konto?</span>
            <Link to={'/'}>
              <button className='btn'>Zaloguj się</button>
            </Link>
          </div>
        </div>
        <div className='formDiv flex'>
          <div className='headerDiv'>
            <img src={logo} alt='logo' />
            <h3>Ustaw hasło</h3>
          </div>

          <form className='form grid' onSubmit={handleSubmit}>
            {error && <span className='showMessage'>{error}</span>}
            <div className='inputDiv'>
              <label htmlFor='newPassword'>Nowe hasło</label>
              <div className='input flex'>
                <BsFillShieldLockFill className='icon' />
                <input
                  type='password'
                  id='newPassword'
                  placeholder='Wprowadź nowe hasło'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className='inputDiv'>
              <label htmlFor='confirmPassword'>Powtórz hasło</label>
              <div className='input flex'>
                <BsFillShieldLockFill className='icon' />
                <input
                  type='password'
                  id='confirmPassword'
                  placeholder='Powtórz nowe hasło'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type='submit' className='btn flex'>
              <span>Zarejestruj się</span>
              <AiOutlineSwapRight className='icon' />
            </button>
            <span className='forgotPassword'>
              Zapomniałeś hasła? <a href=''>Kliknij tutaj</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
