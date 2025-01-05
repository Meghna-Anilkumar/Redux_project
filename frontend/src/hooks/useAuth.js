import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const useAuth = () => {
  const adminData = useSelector(state => state.admin.adminData);
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminData.length) {
      navigate('/admin'); // Redirect to login page if admin is not authenticated
    }
  }, [adminData, navigate]);

  return adminData.length > 0; // Return true if admin is authenticated
};

export default useAuth;
