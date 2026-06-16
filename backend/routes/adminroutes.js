const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/admincontroller');

router.use(protect, adminOnly);
router.post('/create-user', ctrl.createUser);
router.get('/employees', ctrl.getEmployees);
router.post('/assign-project', ctrl.assignProject);
router.get('/projects', ctrl.getProjects);
router.get('/timelogs', ctrl.getTimeLogs);
router.get('/employee-status',ctrl.getEmployeeStatus);
module.exports = router;