import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  adminData: [],
  error: '',
  loading: false
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchAdminRequest(state) {
      state.loading = true;
    },
    fetchAdminSuccess(state, action) {
      state.loading = false;
      state.adminData = action.payload;
    },
    fetchAdminFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.adminData = null;
    },
    updateUserSuccess(state, action) {
      state.loading = false;
      const updatedUser = action.payload;
      state.adminData = state.adminData.map(user =>
        user._id === updatedUser._id ? updatedUser : user
      );
    },
    deleteUserSuccess(state, action) {
      state.loading = false;
      const userId = action.payload;
      state.adminData = state.adminData.filter(user => user._id !== userId);
    },
    addUserSuccess(state, action) {
      state.loading = false;
      state.adminData.push(action.payload);
    }
  }
});

export const {
  fetchAdminRequest,
  fetchAdminSuccess,
  fetchAdminFailure,
  logoutSuccess,
  updateUserSuccess,
  deleteUserSuccess,
  addUserSuccess
} = adminSlice.actions;

export default adminSlice.reducer;

const fetchAdminDataMemoized = async () => {
  try {
    const response = await axios.post('http://localhost:4000/fetchallusers');
    return response.data.data;
  } catch (error) {
    throw new Error(error.message); 
  }
};

export const fetchAdminData = () => async (dispatch) => {
  dispatch(fetchAdminRequest());
  try {
    const data = await fetchAdminDataMemoized();
    dispatch(fetchAdminSuccess(data));
  } catch (error) {
    dispatch(fetchAdminFailure(error.message));
  }
};

export const updateUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.put(`http://localhost:4000/updateuser/${userData.id}`, userData);
    dispatch(updateUserSuccess(response.data.user));
  } catch (error) {
    dispatch(fetchAdminFailure(error.message));
  }
};


export const deleteUser = (userId) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:4000/deleteuser/${userId}`);
    dispatch(deleteUserSuccess(userId));
  } catch (error) {
    console.error(error);
  }
};

export const addUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:4000/adduser', userData);
    dispatch(addUserSuccess(response.data.user));
  } catch (error) {
    console.error(error);
  }
};

export const logoutAdmin = () => async (dispatch) => {
  try {
    await axios.post('http://localhost:4000/logout', {}, { withCredentials: true });
    dispatch(logoutSuccess());
  } catch (error) {
    console.error('Logout error:', error);
  }
};
