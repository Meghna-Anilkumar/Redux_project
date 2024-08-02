const express = require("express");
const multer = require("multer");
const path = require("path");
const UserController = require("../Controllers/UserController");
const verifyToken = require("../Middlewares/userAuth");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/signup', upload.single('profile'), UserController.signUp);
router.post('/login',UserController.login)
router.get('/fetchuserdata', verifyToken, UserController.fetchUserData);
router.post('/updateProfilePicture', upload.single('profile'), UserController.updateProfilePicture);
router.post('/deleteProfilePicture', UserController.deleteProfilePicture);
router.post('/logout', UserController.logout);


module.exports = router;
