import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, logoutSuccess } from '../../redux/Slice/UserSlice';
import axios from 'axios';

function Homepage() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/logout', {}, { withCredentials: true });
      dispatch(logoutSuccess());
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="bg-purple-600 w-full py-4 fixed top-0 left-0 z-50">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-white text-2xl font-bold">MyApp</h1>
          <div>
            {userData ? (
              <>
                <Link to="/profile" className="text-white text-lg hover:underline">
                  User Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white text-lg hover:underline ml-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-white text-lg hover:underline">
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex flex-col items-center mt-16">
        <h2 className="text-3xl font-bold mb-4">Welcome to MyApp!</h2>
        <p className="text-lg text-gray-700 mb-6">
          This is your homepage. Click the link above to navigate to your profile.
        </p>
      </main>
    </div>
  );
}

export default Homepage;
