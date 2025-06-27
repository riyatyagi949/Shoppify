import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && !agree) {
      setError('You must agree to the terms of use & privacy policy');
      return;
    }

    setLoading(true);

    try {
      const url = isLogin
  ? 'https://shoppify-backend-gofd.onrender.com/login'
  : 'https://shoppify-backend-gofd.onrender.com/signup';


      const body = isLogin
        ? { email, password }
        : { username: name, email, password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (data.success) {
        if (isLogin) {
          setSuccess('Login successful!');
          localStorage.setItem('auth-token', data.token); // ✅ Fixed key

          //  Bonus: Redirect to home page after login
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          setSuccess('Signup successful! You can now log in.');
          setIsLogin(true);
          setName('');
          setEmail('');
          setPassword('');
          setAgree(false);
        }
      } else {
        setError(data.message || 'Failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className='logInSignUp'>
      <div className="logInSignUp-container">
        <h1>{isLogin ? 'Log In' : 'Sign Up'}</h1>
        <div className="logInSignUp-fields">
          {!isLogin && (
            <input
              type="text"
              placeholder='Your Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder='Email Address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {!isLogin && (
          <div className="logInSignUp-agree">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}>
          {loading
            ? (isLogin ? 'Logging In...' : 'Signing Up...')
            : (isLogin ? 'Log In' : 'Continue')}
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}

        <p className='logInSignUp-login'>
          {isLogin
            ? "Don't have an account? "
            : 'Already have an account? '}
          <span
            onClick={() => {
              setError('');
              setSuccess('');
              setIsLogin(!isLogin);
            }}
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Sign Up Here' : 'Log In Here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignUp;
