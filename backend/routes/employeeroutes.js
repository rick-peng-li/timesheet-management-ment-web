const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/employeecontroller');

router.use(protect);
router.get('/my-projects', ctrl.getMyProjects);
router.post('/submit-report', ctrl.submitReport);
router.get('/my-logs', ctrl.getMyLogs);
router.post('/start-work',ctrl.startWork);
router.post('/stop-work',ctrl.stopWork);
module.exports = router;