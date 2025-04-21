const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
  organisation_name: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  gst_number: {
    type: String
  },
  contact_email: {
    type: String
  },
  contact_phone: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Organisation', organisationSchema);
