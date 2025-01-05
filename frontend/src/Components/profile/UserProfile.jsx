import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import avatar from '../../assets/profile.png';
import { fetchData } from '../../../redux/Slice/UserSlice';
import Modal from '../Modals/UserDetails'; // Assuming you have a Modal component

function UserProfile() {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setEmail(userData.email);
    }
  }, [userData]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (file) {
      formData.append('profile', file);
    }

    try {
      await axios.post('http://localhost:4000/updateProfile', formData, { withCredentials: true });
      dispatch(fetchData()); // Refresh user data
      setIsModalOpen(false);
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Error updating profile:', error);
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
              <div className="mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => setIsModalOpen(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Profile Picture</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded"
              />
              {preview && <img src={preview} alt="Preview" className="mt-4 w-24 h-24 rounded-full" />}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default UserProfile;
