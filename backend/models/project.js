const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  description:{ type: String },
  deadline:   { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:     { type: String, enum: ['pending','in-progress','completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);