const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const extractAdminIdMiddleware = require('../middlewares/extractAdminIdMiddleware');
const asyncHandler = require('../../../../shared/middlewares/errorHandler/asyncHandler');

// GET /api/admin/me - Get current admin information
router.get('/me', extractAdminIdMiddleware, asyncHandler(AdminController.getMe));

// PUT /api/admin/change-data-many - Update admin data many
router.post('/change-data-many', extractAdminIdMiddleware, asyncHandler(AdminController.changeAdminDataMany));

// PUT /api/admin/change-data-just-one - Update admin data just one
router.post('/change-data-just-one', extractAdminIdMiddleware, asyncHandler(AdminController.changeAdminDataJustOne));

// PUT /api/admin/change-location - Update admin location
router.post('/change-location', extractAdminIdMiddleware, asyncHandler(AdminController.changeLocation));

router.get('/delete-me', extractAdminIdMiddleware, asyncHandler(AdminController.deleteMe));

// POST /api/admin/clear-cookies - Tüm cookie'leri temizle
router.post('/clear-cookies', asyncHandler(AdminController.clearAllCookies));

// Test endpoint - auth servisi ile iletişimi test etmek için
router.post('/test-auth-communication', asyncHandler(AdminController.testAuthCommunication));


// Test endpoint - servisin çalışıp çalışmadığını kontrol etmek için
router.get('/test-service', asyncHandler(AdminController.testService));

module.exports = router;
