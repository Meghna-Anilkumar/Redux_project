import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminData, updateUser, deleteUser, addUser, logoutAdmin } from '../../../redux/Slice/AdminSlice';
import EditUserModal from '../Modals/EditUserModal';
import DeleteUserModal from '../Modals/DeleteUserModal';
import AddUserModal from '../Modals/AddUserModal';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminData = useSelector(state => state.admin.adminData);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAdminData());
  }, [dispatch]);

  const filteredData = adminData.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/admin');
  };

  const handleUpdateUser = (userData) => {
    dispatch(updateUser(userData));
    setEditModalOpen(false);
  };
  
  
  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
    setDeleteModalOpen(false);
  };
  

  const handleAddUser = (userData) => {
    dispatch(addUser(userData));
    setAddModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Logout
        </button>
        <input 
          type="text"
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        <button 
          onClick={() => setAddModalOpen(true)} 
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add User
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(user => (
            <tr key={user._id}>
              <td className="px-4 py-2 border-b">{user.username}</td>
              <td className="px-4 py-2 border-b">{user.email}</td>
              <td className="px-4 py-2 border-b">
                <button 
                  onClick={() => handleEdit(user)} 
                  className="mr-2 px-2 py-1 bg-blue-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(user)} 
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editModalOpen && (
        <EditUserModal
          user={selectedUser}
          closeModal={() => setEditModalOpen(false)}
          updateUser={handleUpdateUser}
        />
      )}

      {deleteModalOpen && (
        <DeleteUserModal
          user={selectedUser}
          closeModal={() => setDeleteModalOpen(false)}
          deleteUser={handleDeleteUser}
        />
      )}

      {addModalOpen && (
        <AddUserModal
          closeModal={() => setAddModalOpen(false)}
          addUser={handleAddUser}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
