const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const extractAdminIdMiddleware = require('../middlewares/extractAdminIdMiddleware');
const asyncHandler = require('../../../../shared/middlewares/errorHandler/asyncHandler');

// GET /api/admin/me - Get current admin information
router.get('/me', extractAdminIdMiddleware, asyncHandler(AdminController.getAdmin));

// PUT /api/admin/change-data-many - Update admin data many
router.post('/change-data-many', extractAdminIdMiddleware, asyncHandler(AdminController.changeAdminDataMany));

// PUT /api/admin/change-data-just-one - Update admin data just one
router.post('/change-data-just-one', extractAdminIdMiddleware, asyncHandler(AdminController.changeAdminDataJustOne));


// Test endpoint - auth servisi ile iletişimi test etmek için
router.post('/test-auth-communication', asyncHandler(AdminController.testAuthCommunication));

module.exports = router;
