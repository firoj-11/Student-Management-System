const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Simple auth logic for ERP demo
  role: { type: String, enum: ['admin', 'user'], default: 'admin' },
  name: { type: String, default: 'Firoj Naik' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
