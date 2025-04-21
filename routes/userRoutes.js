// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerUser, getAllUsers ,loginUser ,getUserById ,deleteUserById ,updateUserById} = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/register', upload.single('profilePhoto'), registerUser);
router.get('/', getAllUsers);
router.post('/login', loginUser);
router.post('/getuserbyid', getUserById);
router.delete('/delete', deleteUserById);
router.post('/update', upload.single('profilePhoto'), updateUserById);






module.exports = router;
