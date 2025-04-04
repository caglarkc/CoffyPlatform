const express = require('express');
const router = express.Router();
const AdminAuthController = require('../controllers/admin.auth.controller');
const { authAdminMiddleware } = require('../middlewares/adminMiddleware');
const asyncHandler = require('../../../../shared/middlewares/errorHandler/asyncHandler');

// Açık rotalar - kimlik doğrulama gerektirmez
router.post('/login', asyncHandler(AdminAuthController.loginAdmin));
router.get('/check-phone', asyncHandler(AdminAuthController.checkPhone));
router.get('/check-email', asyncHandler(AdminAuthController.checkEmail));
router.post('/refresh-access-token', asyncHandler(AdminAuthController.refreshAccessToken));
router.get('/check-cookie', asyncHandler(AdminAuthController.checkCookie));
router.get('/me', authAdminMiddleware, asyncHandler(AdminAuthController.getAdmin));
router.post('/create-creator', asyncHandler(AdminAuthController.createCreator));

// Test endpoint - servisin çalışıp çalışmadığını kontrol etmek için
router.get('/test-service', asyncHandler(AdminAuthController.testService));

// Korumalı rotalar - kimlik doğrulama gerektirir
router.post('/create-admin', authAdminMiddleware,asyncHandler(AdminAuthController.createAdmin));
router.get('/logout', authAdminMiddleware, asyncHandler(AdminAuthController.logoutAdmin));



module.exports = router;
