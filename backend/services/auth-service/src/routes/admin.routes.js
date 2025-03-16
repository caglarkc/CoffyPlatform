const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');

router.post('/register-admin', AdminController.registerAdmin);
router.post('/upgrade-role', AdminController.upgradeRole);
router.post('/downgrade-role', AdminController.downgradeRole);
router.post('/update-admin', AdminController.updateAdmin);
router.post('/change-location', AdminController.changeLocation);

router.post('/login-admin', AdminController.loginAdmin);
router.post('/delete-admin', AdminController.deleteAdmin);
router.post('/refresh-access-token', AdminController.refreshAccessToken);
router.post('/check-phone', AdminController.checkPhone);
router.post('/check-email', AdminController.checkEmail);


module.exports = router;
