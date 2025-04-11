const express = require('express');
const router = express.Router();
const AdminAuthController = require('../controllers/admin.auth.controller');
const { authAdminMiddleware } = require('../middlewares/adminMiddleware');
const asyncHandler = require('../../../../shared/middlewares/errorHandler/asyncHandler');

// Açık rotalar - kimlik doğrulama gerektirmez
router.post('/login', asyncHandler(AdminAuthController.loginAdmin));
router.get('/check-phone', asyncHandler(AdminAuthController.checkPhone));
router.get('/check-email', asyncHandler(AdminAuthController.checkEmail));
router.get('/cookie-refresh', asyncHandler(AdminAuthController.cookieRefreshToken));
router.get('/check-cookies', asyncHandler(AdminAuthController.checkCookie));
router.get('/me', authAdminMiddleware, asyncHandler(AdminAuthController.getAdmin));
router.post('/create-creator', asyncHandler(AdminAuthController.createCreator));
router.get('/clear-cookies', asyncHandler(AdminAuthController.clearAllCookies));
router.get('/clear-access-token', asyncHandler(AdminAuthController.clearAccessToken));

// Test endpoint - servisin çalışıp çalışmadığını kontrol etmek için
router.get('/test-service', asyncHandler(AdminAuthController.testService));

// Korumalı rotalar - kimlik doğrulama gerektirir
router.post('/create-admin', authAdminMiddleware,asyncHandler(AdminAuthController.createAdmin));
router.get('/logout', authAdminMiddleware, asyncHandler(AdminAuthController.logoutAdmin));
router.post('/change-password', authAdminMiddleware, asyncHandler(AdminAuthController.changePassword));


module.exports = router;
