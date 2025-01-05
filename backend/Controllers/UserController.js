const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const signUp = async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password || '', 10);
        const findEmail = await User.findOne({ email });

        if (findEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        
        const profilePath = req.file ? req.file.path : '';

        const user = new User({
            username,
            email,
            password: hashedPassword,
            profile: profilePath
        });

        const savedUser = await user.save();
        console.log(savedUser);
        
        const token = jwt.sign({
            user: savedUser._id
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        }).json({ success: true });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Create token
        const token = jwt.sign({
            user: user._id
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        }).json({ success: true });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const fetchUserData = async (req, res) => {
    try {
      console.log('Cookies:', req.cookies); 
      const token = req.cookies.token;
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const data = await User.findById(verified.user);
      res.json(data);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

  const updateUserProfile = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Access Denied" });
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const userId = verified.user;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
  
     
      if (req.body.username) {
        user.username = req.body.username;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
  
   
      if (req.file) {
        if (user.profile) {
          fs.unlinkSync(path.join(__dirname, '..', user.profile));
        }
        user.profile = req.file.path;
      }
  
      await user.save();
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  
  const deleteProfilePicture = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Access Denied" });
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const userId = verified.user;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      if (user.profile) {
        const filePath = path.join(__dirname, '..', user.profile);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
        user.profile = '';
        await user.save();
      }
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting profile picture:', error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const logout = async (req, res) => {
    try {
       
        res.clearCookie("token").json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
  
  



module.exports = {
    signUp,login,fetchUserData,updateUserProfile,deleteProfilePicture,logout
}
