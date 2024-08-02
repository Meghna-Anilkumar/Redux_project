import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import avatar from '../../assets/profile.png';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(uploadedFile.type)) {
        toast.error('Invalid image format. Please select a JPEG, PNG, or GIF image.');
        return;
      }
      setFile(uploadedFile);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    setLoading(true);
    if (!username) {
      setLoading(false);
      toast.error('Please enter the username');
      return;
    }
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
    if (username.length < 3 || username.includes(' ')) {
      setLoading(false);
      toast.error('Please enter a valid username');
      return;
    }
    if (!emailRegex.test(email)) {
      setLoading(false);
      toast.error('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      setLoading(false);
      toast.warning('Password must be at least 6 characters long');
      return;
    }
    if (/\s/.test(password)) {
      setLoading(false);
      toast.error('Password should not contain spaces');
      return;
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setLoading(false);
      toast.error('Password should contain at least one uppercase letter, one lowercase letter, and one digit');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (file) {
        formData.append('profile', file);
      }

      const response = await axios.post('http://localhost:4000/signup', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        navigate('/');
        toast.success('Signed Up Successfully');
      }
    } catch (error) {
      toast.error(error.response?.data || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
        <div className="mb-4">
          <h1 className="text-2xl text-center text-purple-600 font-bold mb-1">MY APP</h1>
          <h2 className="text-center text-gray-600">Sign Up</h2>
        </div>
        <form onSubmit={submit}>
          <div className="profile flex justify-center py-2">
            <label htmlFor="profile">
              <img
                src={file ? URL.createObjectURL(file) : avatar}
                className="profile_img w-16 h-16 rounded-full"
                alt="avatar"
              />
            </label>
            <input
              onChange={onUpload}
              type="file"
              id="profile"
              name="file"
              accept="image/*"
              aria-required="true"
              className="hidden"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              id="username"
              type="text"
              value={username}
              placeholder="Username"
              aria-required="true"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              id="email"
              value={email}
              type="email"
              placeholder="Email"
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              id="password"
              value={password}
              type="password"
              placeholder="******************"
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
