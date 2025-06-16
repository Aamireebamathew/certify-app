
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert('🎉 Registration successful! Check your email to confirm.');
      navigate('/login');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Create Your CertifyApp Account</h2>
        <form onSubmit={handleRegister} className="login-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
          <p className="redirect-link">
            Already have an account? <a href="/login">Login</a>
          </p>
          {errorMsg && <p className="error-message">⚠ {errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
