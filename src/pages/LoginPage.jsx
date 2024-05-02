// LoginPage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import background from '../assets/backgroundImage.jpg'; // Ensure this is the correct path to your image

// Styled Components
const LoginWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ImageSide = styled.div`
  flex: 1;
  background: url(${background}) no-repeat center center;
  background-size: cover;
`;

const FormSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  background: #f7f7f7;
`;

const LoginForm = styled.form`
  max-width: 320px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const SignInButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: white;
  margin-bottom: 8px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const ForgotPasswordLink = styled.a`
  display: block;
  color: #007bff;
  text-align: right;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const SignUpLink = styled(ForgotPasswordLink)`
  text-align: center;
  margin-top: 16px;
`;

// Login Page Component
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    // Implement login logic here
    console.log('Logging in', username, password);
  };

  return (
    <LoginWrapper>
      <ImageSide />
      <FormSide>
        <LoginForm onSubmit={handleLogin}>
          <Title>ACCOUNT LOGIN</Title>
          <Input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SignInButton type='submit'>SIGN IN</SignInButton>
          <ForgotPasswordLink href='#'>
            Forgot Username / password?
          </ForgotPasswordLink>
          <SignUpLink href='#'>SIGN UP</SignUpLink>
        </LoginForm>
      </FormSide>
    </LoginWrapper>
  );
}

export default LoginPage;
