const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Female' },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  enrollDate: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  avatar: { type: String, default: '' },
  grades: {
    type: Map,
    of: Number,
    default: {
      'Database Systems': 75,
      'Java Programming': 80,
      'Data Structures': 70,
      'Web Development': 85,
      'Computer Networks': 78
    }
  },
  attendance: {
    type: Map,
    of: String, // Map of YYYY-MM-DD -> 'present' | 'absent' | 'late'
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
