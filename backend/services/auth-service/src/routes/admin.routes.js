const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { authAdminMiddleware, authorizeAdmin, ROLES } = require('../middlewares/authMiddleware');
const asyncHandler = require('../middlewares/errorHandler/asyncHandler');

// Açık rotalar - kimlik doğrulama gerektirmez
router.post('/login-admin', asyncHandler(AdminController.loginAdmin));
router.post('/check-phone', asyncHandler(AdminController.checkPhone));
router.post('/check-email', asyncHandler(AdminController.checkEmail));
router.post('/refresh-access-token', asyncHandler(AdminController.refreshAccessToken));
router.get('/check-cookie', asyncHandler(AdminController.checkCookie));
router.post('/cookie-refresh', asyncHandler(AdminController.cookieRefreshToken));

// Korumalı rotalar - kimlik doğrulama gerektirir
router.post('/register-admin', authAdminMiddleware, authorizeAdmin(ROLES.REGION_ADMIN), asyncHandler(AdminController.registerAdmin));
router.post('/upgrade-role', authAdminMiddleware, authorizeAdmin(ROLES.REGION_ADMIN), asyncHandler(AdminController.upgradeRole));
router.post('/downgrade-role', authAdminMiddleware, authorizeAdmin(ROLES.REGION_ADMIN), asyncHandler(AdminController.downgradeRole));
router.post('/update-admin', authAdminMiddleware, asyncHandler(AdminController.updateAdmin));
router.post('/change-location', authAdminMiddleware, authorizeAdmin(ROLES.REGION_ADMIN), asyncHandler(AdminController.changeLocation));
router.post('/delete-admin', authAdminMiddleware, authorizeAdmin(ROLES.REGION_ADMIN), asyncHandler(AdminController.deleteAdmin));
router.post('/logout', authAdminMiddleware, asyncHandler(AdminController.logoutAdmin));

module.exports = router;
