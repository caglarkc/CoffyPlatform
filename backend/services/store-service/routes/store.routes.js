const express = require('express');
const router = express.Router();
const {authAdminMiddleware} = require('../middlewares/adminMiddleware');
const asyncHandler = require('../middlewares/errorHandler/asyncHandler');
const StoreController = require('../controllers/store.controller');

router.post('/create-store', authAdminMiddleware, asyncHandler(StoreController.createStore));

router.get('/get-login', authAdminMiddleware, asyncHandler(StoreController.getLogin));

router.get('/health', (req, res) => {
    res.status(200).json({ message: 'OK' });
});
module.exports = router;