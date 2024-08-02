import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setLoading(false);
      toast.error('Please enter the email');
      return;
    }
    if (!password) {
      setLoading(false);
      toast.error('Please enter the password');
      return;
    }
    if (!emailRegex.test(email)) {
      setLoading(false);
      toast.error('Please enter a valid email');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:4000/adminlogin',
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate('/dashboard');
        toast.success('Logged In Successfully');
      }
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-3xl text-center text-purple-600 font-bold mb-2">MY APP</h1>
          <h2 className="text-center text-gray-600">Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">Remember me</span>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
