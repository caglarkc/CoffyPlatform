const express = require('express');
const router = express.Router();
const {authAdminMiddleware} = require('../middlewares/adminMiddleware');
const asyncHandler = require('../middlewares/errorHandler/asyncHandler');
const StoreController = require('../controllers/store.controller');

router.post('/create-store', authAdminMiddleware, asyncHandler(StoreController.createStore));




module.exports = router;