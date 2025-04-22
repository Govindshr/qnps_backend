const mongoose = require('mongoose');

const clientschema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    logo: { type: String, default: '' },
    address: { type: String, required: true },
    contact_number: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    organisation_id: { type: mongoose.Schema.Types.ObjectId},
    updatedAt: { type: Date },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      
    startDate: { type: Date },
    endDate: { type: Date },
      
  });
  

module.exports = mongoose.model('Clients', clientschema);

const processSchema = new mongoose.Schema({
  process_name: { type: String, required: true },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Clients', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Process', processSchema);
