const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema({
  employee:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  startTime:   { type: Date },
  endTime:     { type: Date },
  hoursWorked: { type: Number, default: 0 },  // ✅ default 0, not required
  report:      { type: String },
  status:      { type: String, enum: ['active', 'completed'], default: 'active' },
  date:        { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('TimeLog', timeLogSchema);