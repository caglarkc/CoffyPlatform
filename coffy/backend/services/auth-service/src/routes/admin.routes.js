const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { authAdminMiddleware } = require('../../../../shared/middlewares/adminMiddleware');
const asyncHandler = require('../../../../shared/middlewares/errorHandler/asyncHandler');

// Açık rotalar - kimlik doğrulama gerektirmez
router.post('/login-admin', asyncHandler(AdminController.loginAdmin));
router.post('/check-phone', asyncHandler(AdminController.checkPhone));
router.post('/check-email', asyncHandler(AdminController.checkEmail));
router.post('/refresh-access-token', asyncHandler(AdminController.refreshAccessToken));
router.get('/check-cookie', asyncHandler(AdminController.checkCookie));
router.post('/cookie-refresh', asyncHandler(AdminController.cookieRefreshToken));
router.get('/me', authAdminMiddleware, asyncHandler(AdminController.getAdminProfile));

// Korumalı rotalar - kimlik doğrulama gerektirir
router.post('/register-admin', authAdminMiddleware,asyncHandler(AdminController.registerAdmin));
router.post('/upgrade-role', authAdminMiddleware, asyncHandler(AdminController.upgradeRole));
router.post('/downgrade-role', authAdminMiddleware, asyncHandler(AdminController.downgradeRole));
router.post('/update-admin', authAdminMiddleware, asyncHandler(AdminController.updateAdmin));
router.post('/change-location', authAdminMiddleware, asyncHandler(AdminController.changeLocation));
router.post('/delete-admin', authAdminMiddleware, asyncHandler(AdminController.deleteAdmin));
router.post('/logout', authAdminMiddleware, asyncHandler(AdminController.logoutAdmin));


router.get('/get-users', authAdminMiddleware, asyncHandler(AdminController.getUsers));
router.post('/get-users-with-unique-data', authAdminMiddleware, asyncHandler(AdminController.getUsersWithUniqueData));
router.post('/filter-users', authAdminMiddleware, asyncHandler(AdminController.filterUsers));
router.post('/block-user', authAdminMiddleware, asyncHandler(AdminController.blockUser));
router.post('/delete-user', authAdminMiddleware, asyncHandler(AdminController.deleteUser));

module.exports = router;
