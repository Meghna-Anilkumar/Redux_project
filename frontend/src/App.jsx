import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Adminloginpage from "./Pages/Adminloginpage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import Homepage from "./Pages/Homepage";
import UserProfile from "./Pages/UserProfilePage";
import AdminDashboardpage from "./Pages/AdminDashboard";
import "./App.css";

function App() {
  
  return (
    <div>
      <Router>
        <Routes>

          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<Adminloginpage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/dashboard" element={<AdminDashboardpage/>} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
