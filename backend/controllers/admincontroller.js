const User = require('../models/User');
const Project = require('../models/Project');
const TimeLog = require('../models/TimeLog');
const bcrypt = require('bcryptjs');

// Create employee or admin
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  const employees = await User.find({ role: 'employee' }).select('-password');
  res.json(employees);
};

// Assign project
exports.assignProject = async (req, res) => {
  const { title, description, deadline, assignedTo } = req.body;
  try {
    const project = await Project.create({
      title, description, deadline, assignedTo, createdBy: req.user._id
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  const projects = await Project.find().populate('assignedTo', 'name email');
  res.json(projects);
};

// Get time logs
exports.getTimeLogs = async (req, res) => {
  const logs = await TimeLog.find()
    .populate('employee', 'name email')
    .populate('project', 'title');
  res.json(logs);
};
// Get all employees with online status + today's hours
exports.getEmployeeStatus = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await Promise.all(employees.map(async (emp) => {
      const todayLogs = await TimeLog.find({
        employee: emp._id,
        status: 'completed',
        date: { $gte: todayStart }
      }).populate('project', 'title');

      const activeLog = await TimeLog.findOne({
        employee: emp._id,
        status: 'active'
      }).populate('project', 'title');

      const totalHoursToday = todayLogs.reduce(
        (sum, log) => sum + Number(log.hoursWorked), 0
      ).toFixed(2);

      return {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        isOnline: emp.isOnline,
        lastSeen: emp.lastSeen,
        totalHoursToday,
        currentProject: activeLog?.project?.title || null,
        workStartedAt: activeLog?.startTime || null,
        todayLogs
      };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};