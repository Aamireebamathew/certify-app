import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiUpload, FiEye, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="custom-navbar">
      <div className="nav-left" onClick={() => navigate('/dashboard')}>
        🎓 CertifyApp
      </div>
      <div className="nav-right">
        <button title="Upload Certificate" onClick={() => navigate('/upload')}>
          <FiUpload style={{ marginRight: '6px' }} />
          Upload
        </button>
        <button title="View Certificates" onClick={() => navigate('/view')}>
          <FiEye style={{ marginRight: '6px' }} />
          View
        </button>
        <button title="Toggle Theme" onClick={toggleTheme}>
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
        <button title="Logout" onClick={handleLogout}>
          <FiLogOut style={{ marginRight: '6px' }} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
