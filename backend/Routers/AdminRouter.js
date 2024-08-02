const express = require("express");
const AdminController = require('../Controllers/AdminController');
const router = express.Router();

router.post('/adminlogin', AdminController.AdminLogin);
router.post('/fetchallusers', AdminController.fetchAllUsers);
router.put('/updateuser/:id', AdminController.editUser) 
router.delete('/deleteuser/:id', AdminController.deleteUser);
router.post('/adduser', AdminController.addUser);

module.exports = router;
