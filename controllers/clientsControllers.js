const path = require('path');
const Clients = require('../models/Clients');
const jwt = require('jsonwebtoken');

const registerClient = async (req, res) => {
  const { name, email, address, contact_number, startDate ,endDate,createdBy} = req.body;

  if (!name || !email || !contact_number || !address || !createdBy) {
    return res.status(400).json({ message: 'Name, email, Contact Number , Address , and Creator are required.' });
  }
  

  

  try {
    const emailExists = await Clients.findOne({ email });
    const contactExists = await Clients.findOne({ contact_number });

    if (emailExists || contactExists) {
      return res.status(409).json({ message: 'Email or Contact Number already registered.' });
    }

  
    const logo = req.file ? `/uploads/${req.file.filename}` : '';

    const newClient = new Clients({
      name,
      email,
      address,
      contact_number,
      createdBy,
      logo,
      startDate : startDate || null,
      endDate: endDate || null,
      updatedAt: new Date() // optional
    });
    

    await newClient.save();

    const clientToReturn = { ...newClient._doc };
   
    res.status(201).json({ message: 'Client registered successfully.', user: clientToReturn });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllClients = async (req, res) => {
  const { name, email, contact_number, page = 1, limit = 10 } = req.body;

  try {
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (contact_number) filter.contact_number = { $regex: contact_number, $options: 'i' };
   

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalClients = await Clients.countDocuments(filter);
    const clients = await Clients.find(filter)
      .skip(skip)
      .limit(parseInt(limit));

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

    res.status(200).json({
      status: 200,
      error: false,
      message: 'Clients fetched successfully',
      imageUrl: baseUrl,
      total: totalClients,
      page: parseInt(page),
      limit: parseInt(limit),
      data: clients
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: true,
      message: 'Failed to fetch users',
      imageUrl: null,
      data: []
    });
  }
};

module.exports = { registerClient ,getAllClients};
