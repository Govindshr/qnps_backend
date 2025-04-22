const path = require("path");
const Clients = require("../models/Clients");
const jwt = require("jsonwebtoken");

const registerClient = async (req, res) => {
  const {
    name,
    email,
    address,
    contact_number,
    startDate,
    endDate,
    createdBy,
  } = req.body;

  if (!name || !email || !contact_number || !address || !createdBy) {
    return res
      .status(400)
      .json({
        message:
          "Name, email, Contact Number , Address , and Creator are required.",
      });
  }

  try {
    const emailExists = await Clients.findOne({ email });
    const contactExists = await Clients.findOne({ contact_number });

    if (emailExists || contactExists) {
      return res
        .status(409)
        .json({ message: "Email or Contact Number already registered." });
    }

    const logo = req.file ? `/uploads/${req.file.filename}` : "";

    const newClient = new Clients({
      name,
      email,
      address,
      contact_number,
      createdBy,
      logo,
      startDate: startDate || null,
      endDate: endDate || null,
      updatedAt: new Date(), // optional
    });

    await newClient.save();

    const clientToReturn = { ...newClient._doc };

    res
      .status(201)
      .json({
        message: "Client registered successfully.",
        user: clientToReturn,
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllClients = async (req, res) => {
  const { name, email, contact_number, page = 1, limit = 10 } = req.body;

  try {
    const filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (contact_number)
      filter.contact_number = { $regex: contact_number, $options: "i" };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalClients = await Clients.countDocuments(filter);
    const clients = await Clients.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

    res.status(200).json({
      status: 200,
      error: false,
      message: "Clients fetched successfully",
      imageUrl: baseUrl,
      total: totalClients,
      page: parseInt(page),
      limit: parseInt(limit),
      data: clients,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: true,
      message: "Failed to fetch users",
      imageUrl: null,
      data: [],
    });
  }
};

const getClientById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ message: "Client ID is required in request body" });
  }

  try {
    const clients = await Clients.findById(id)
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    if (!clients) {
      return res.status(404).json({ message: "User not found" });
    }

    const clientToReturn = {
      ...clients._doc,
    };

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;
    res.status(200).json({
      status: 200,
      error: false,
      imageUrl: baseUrl,
      message: "Client Details fetched successfully",
      data: clientToReturn,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: true,
      imageUrl: null,
      message: "Failed to fetch user",
      data: null,
    });
  }
};

const deleteClientById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ message: "Client ID is required in request body" });
  }

  try {
    const client = await Clients.findByIdAndDelete(id);

    if (!client) {
      return res
        .status(404)
        .json({ message: "Client not found or already deleted" });
    }

    res.status(200).json({
      status: 200,
      error: false,
      message: "Client deleted successfully",
      data: {
        id: client._id,
        name: client.name,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: true,
      message: "Failed to delete user",
      data: null,
    });
  }
};

const updateClientById = async (req, res) => {
  const {
    id,
    name,
    email,
    address,
    contact_number,
    startDate,
    endDate,
    createdBy,
    updatedBy,
    status,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  try {
    const updateData = {
      updatedAt: new Date(), // ✅ update timestamp
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (contact_number) updateData.contact_number = contact_number;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (createdBy) updateData.createdBy = createdBy;
    if (updatedBy) updateData.updatedBy = updatedBy;
    if (status) updateData.status = status;
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    const updatedClient = await Clients.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    const clientToReturn = { ...updatedClient._doc };

    res.status(200).json({
      status: 200,
      error: false,
      message: "Client updated successfully",
      data: clientToReturn,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: true,
      message: "Failed to update user",
      data: null,
    });
  }
};

module.exports = {
  registerClient,
  getAllClients,
  getClientById,
  deleteClientById,
  updateClientById,
};
