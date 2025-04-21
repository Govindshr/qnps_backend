const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, default: '' },
    user_role: { type: String, enum: ['admin', 'super_admin', 'agent'], default: 'agent' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    organisation_id: { type: mongoose.Schema.Types.ObjectId,ref: 'Organisation' },
    super_admin_id: { type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    admin_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      
  });
  

module.exports = mongoose.model('User', userSchema);
