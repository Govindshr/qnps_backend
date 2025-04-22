// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerClient ,getAllClients ,getClientById } = require('../controllers/clientsControllers');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/addClients', upload.single('logo'), registerClient);
router.post('/all', getAllClients);
router.post('/getClientById', getClientById);
// router.post('/delete', deleteUserById);
// router.post('/login', loginUser);
// router.post('/update', upload.single('profilePhoto'), updateUserById);






module.exports = router;
