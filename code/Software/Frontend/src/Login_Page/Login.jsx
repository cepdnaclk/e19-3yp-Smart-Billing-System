import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import './Login.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    console.log('Login submitted:', { username, password, rememberMe });
    navigate('/AdminDashboard');
    
    setUsername('');
    setPassword('');
    setRememberMe(false);
  };

  return ( 
    <div className="login-container">
      <div className="header-bar ">
        <h2 style={{ color: 'white', textAlign: 'left' }}><b>SMART</b> <span className="thin-text">BILLING SYSTEM</span></h2>
      </div>
    <div className='form'>
      <h2>Welcome back!</h2>
      <form onSubmit={handleLogin}>
      <label htmlFor="email">Username</label>
      <div className="input-with-icon">
        <FontAwesomeIcon icon={faUser} className="icon" />
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
      </div>

      <label htmlFor="email">Password</label>
      <div className="input-with-icon">
  <FontAwesomeIcon icon={faLock} className="icon" />
  <input
    type="password"
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    required
  />
</div>
        <div>
          <button className="login_button" type="submit">Login</button>
        </div>
        
        
          <label className="form-check-label">
            <input type="checkbox" 
            className="form-check-input" 
            id="rememberMe" 
            checked={rememberMe} 
            onChange={(e)=> setRememberMe(e.target.checked)}/>

              <small> Remember Me</small>
          </label>
      </form>
      <p>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
    <div className="footer-bar ">
        <h6 style={{ color: 'white', textAlign: 'center'}}><span className="thin-text">@2023 Smart Billing System. All right reserved.</span></h6>
      </div>
   </div>
  );
};

export default Login;
