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
router.post('/cookie-refresh', asyncHandler(AdminAuthController.cookieRefreshToken));
router.get('/me', authAdminMiddleware, asyncHandler(AdminAuthController.getAdmin));

// Korumalı rotalar - kimlik doğrulama gerektirir
router.post('/create-admin', authAdminMiddleware,asyncHandler(AdminAuthController.createAdmin));
//router.post('/upgrade-role', authAdminMiddleware, asyncHandler(AdminAuthController.upgradeRole));
//router.post('/downgrade-role', authAdminMiddleware, asyncHandler(AdminAuthController.downgradeRole));
//router.post('/update-admin', authAdminMiddleware, asyncHandler(AdminAuthController.updateAdmin));
//router.post('/change-location', authAdminMiddleware, asyncHandler(AdminAuthController.changeLocation));
//router.post('/delete-admin', authAdminMiddleware, asyncHandler(AdminAuthController.deleteAdmin));
router.post('/logout', authAdminMiddleware, asyncHandler(AdminAuthController.logoutAdmin));


//router.get('/get-users', authAdminMiddleware, asyncHandler(AdminAuthController.getUsers));
//router.post('/get-users-with-unique-data', authAdminMiddleware, asyncHandler(AdminAuthController.getUsersWithUniqueData));
//router.post('/filter-users', authAdminMiddleware, asyncHandler(AdminAuthController.filterUsers));
//router.post('/block-user', authAdminMiddleware, asyncHandler(AdminAuthController.blockUser));
//router.post('/delete-user', authAdminMiddleware, asyncHandler(AdminAuthController.deleteUser));


router.post('/create-creator', asyncHandler(AdminAuthController.createCreator));
module.exports = router;
