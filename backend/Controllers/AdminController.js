const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const bcrypt = require('bcrypt');

const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json('Email incorrect');
    }
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json('Password incorrect');
    }
    const token = jwt.sign(email, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    }).json({ success: true });

  } catch (error) {
    console.log(error.message);
  }
};

const fetchAllUsers = async (req, res) => {
  try {
    const data = await User.find();
    res.json({ data });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token").json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};

const editUser = async (req, res) => {
  try {
    const { id, username, email } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    user.email = email;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const addUser = async (req, res) => {
  try {
    const { username, email, password, profile } = req.body;
    const hashedPassword = await bcrypt.hash(password || '', 10);
    const findEmail = await User.findOne({ email });

    if (findEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = new User({
      username,
      email,
      password: hashedPassword,
      profile,
    });

    const savedUser = await user.save();
    res.status(200).json({ message: 'New user added', user: savedUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  AdminLogin, fetchAllUsers, logout, editUser, deleteUser, addUser
};
