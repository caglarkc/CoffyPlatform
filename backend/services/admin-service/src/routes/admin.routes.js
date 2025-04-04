const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { authAdminMiddleware } = require('../../../../shared/middlewares/adminMiddleware');
const asyncHandler = require('../../../../shared/middlewares/errorHandler/asyncHandler');

// PUT /api/admin/:adminId/name - Update admin name
router.put('/:adminId/name', authAdminMiddleware, asyncHandler(AdminController.updateAdminName));

module.exports = router;
