import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import avatar from '../../assets/profile.png';
import { fetchData } from '../../../redux/Slice/UserSlice';

function UserProfile() {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profile', file);

    try {
      await axios.post('http://localhost:4000/updateProfilePicture', formData, { withCredentials: true });
      dispatch(fetchData()); // Refresh user data
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post('http://localhost:4000/deleteProfilePicture', {}, { withCredentials: true });
      dispatch(fetchData()); // Refresh user data
    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-600 w-full py-4 fixed top-0 left-0 z-50">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-white text-2xl font-bold">MyApp</h1>
          <div>
            <Link to="/" className="text-white text-lg hover:underline">
              Home
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-grow pt-16 px-4">
        <div className="container mx-auto mt-8">
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-6">
            <img
              src={preview || (userData?.profile ? `http://localhost:4000/${userData.profile}` : avatar)}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold">{userData?.username}</h2>
              <p className="text-gray-700">{userData?.email}</p>
              <div className="mt-4 flex space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  Edit
                </button>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleUpload}
                  disabled={!file}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserProfile;
