// index.js
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const organisationRoutes = require('./routes/organisationRoutes');
const path = require('path');
const cors =require('cors')

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/organisations', organisationRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
