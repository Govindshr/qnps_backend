const Organisation = require('../models/Organisation');

const addOrganisation = async (req, res) => {
  const { organisation_name, address, gst_number, contact_email, contact_phone } = req.body;

  if (!organisation_name) {
    return res.status(400).json({ message: 'organisation_name is required' });
  }

  try {
    const newOrg = new Organisation({
      organisation_name,
      address,
      gst_number,
      contact_email,
      contact_phone,
      updatedAt: new Date() // optional
    });

    await newOrg.save();

    res.status(201).json({
      status: 201,
      error: false,
      message: 'Organisation created successfully',
      data: newOrg
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: true,
      message: 'Failed to create organisation',
      data: null
    });
  }
};

const getAllOrganisations = async (req, res) => {
    const { organisation_name, page = 1, limit = 10 } = req.body;
  
    try {
      const filter = {};
  
      if (organisation_name) {
        filter.organisation_name = { $regex: organisation_name, $options: 'i' };
      }
  
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Organisation.countDocuments(filter);
      const organisations = await Organisation.find(filter).skip(skip).limit(parseInt(limit));
  
      res.status(200).json({
        status: 200,
        error: false,
        message: 'Organisations fetched successfully',
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: organisations
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: true,
        message: 'Failed to fetch organisations',
        data: []
      });
    }
  };

  const getOrganisationById = async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: 'Organisation ID is required' });
    }
  
    try {
      const organisation = await Organisation.findById(id);
  
      if (!organisation) {
        return res.status(404).json({ message: 'Organisation not found' });
      }
  
      res.status(200).json({
        status: 200,
        error: false,
        message: 'Organisation fetched successfully',
        data: organisation
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: true,
        message: 'Failed to fetch organisation',
        data: null
      });
    }
  };

  const deleteOrganisationById = async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: 'Organisation ID is required' });
    }
  
    try {
      const organisation = await Organisation.findByIdAndDelete(id);
  
      if (!organisation) {
        return res.status(404).json({ message: 'Organisation not found or already deleted' });
      }
  
      res.status(200).json({
        status: 200,
        error: false,
        message: 'Organisation deleted successfully',
        data: {
          id: organisation._id,
          organisation_name: organisation.organisation_name
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: true,
        message: 'Failed to delete organisation',
        data: null
      });
    }
  };
  
  const updateOrganisationById = async (req, res) => {
    const {
      id,
      organisation_name,
      address,
      gst_number,
      contact_email,
      contact_phone,
      status
    } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: 'Organisation ID is required' });
    }
  
    try {
      const updateData = {
        updatedAt: new Date() // ✅ Always update timestamp
      };
  
      if (organisation_name) updateData.organisation_name = organisation_name;
      if (address) updateData.address = address;
      if (gst_number) updateData.gst_number = gst_number;
      if (contact_email) updateData.contact_email = contact_email;
      if (contact_phone) updateData.contact_phone = contact_phone;
      if (status) updateData.status = status;
  
      const updatedOrg = await Organisation.findByIdAndUpdate(id, updateData, {
        new: true
      });
  
      if (!updatedOrg) {
        return res.status(404).json({ message: 'Organisation not found' });
      }
  
      res.status(200).json({
        status: 200,
        error: false,
        message: 'Organisation updated successfully',
        data: updatedOrg
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: true,
        message: 'Failed to update organisation',
        data: null
      });
    }
  };
  
  
  
  
module.exports = { addOrganisation ,getAllOrganisations ,getOrganisationById , deleteOrganisationById  ,updateOrganisationById};
