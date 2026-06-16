const Project = require('../models/Project');
const TimeLog = require('../models/TimeLog');

// View assigned projects
exports.getMyProjects = async (req, res) => {
  const projects = await Project.find({ assignedTo: req.user._id });
  res.json(projects);
};

// START work
exports.startWork = async (req, res) => {
  const { projectId } = req.body;
  try {
    const existing = await TimeLog.findOne({
      employee: req.user._id,
      project: projectId,
      status: 'active'
    });
    if (existing) {
      return res.status(400).json({ message: 'Already working on this project' });
    }
    const log = await TimeLog.create({
      employee: req.user._id,
      project: projectId,
      startTime: new Date(),
      status: 'active'
    });
    await Project.findByIdAndUpdate(projectId, { status: 'in-progress' });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// STOP work
exports.stopWork = async (req, res) => {
  const { projectId } = req.body;
  try {
    const log = await TimeLog.findOne({
      employee: req.user._id,
      project: projectId,
      status: 'active'
    });
    if (!log) {
      return res.status(404).json({ message: 'No active session found' });
    }
    const endTime = new Date();
    const hoursWorked = ((endTime - log.startTime) / (1000 * 60 * 60)).toFixed(2);
    log.endTime = endTime;
    log.hoursWorked = hoursWorked;
    log.status = 'completed';
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Submit report
exports.submitReport = async (req, res) => {
  const { projectId, report } = req.body;
  try {
    const log = await TimeLog.findOne({
      employee: req.user._id,
      project: projectId,
      status: 'completed'
    }).sort({ createdAt: -1 });
    if (log) {
      log.report = report;
      await log.save();
      return res.json(log);
    }
    res.status(404).json({ message: 'Stop work first before submitting report!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get my logs
exports.getMyLogs = async (req, res) => {
  const logs = await TimeLog.find({ employee: req.user._id })
    .populate('project', 'title deadline');
  res.json(logs);
};