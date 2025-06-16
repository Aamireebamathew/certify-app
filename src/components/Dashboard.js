import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      } else {
        navigate('/login');
      }
      setLoading(false);
    };
    getUser();
  }, [navigate]);

  const getUsername = (email) => {
    if (!email) return '';
    return email.split('@')[0];
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-box">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2>Welcome, {getUsername(userEmail)}!</h2>
            <p className="user-email">{userEmail}</p>
            <div className="dashboard-buttons">
              <button onClick={() => navigate('/upload')}>Upload Certificate</button>
              <button onClick={() => navigate('/view')}>View Certificates</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
