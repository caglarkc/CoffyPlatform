const StoreService = require('../services/store.service');


class StoreController {

    async createStore(req, res, next) {
        try {
            const loggedAdmin = req.admin;
            const result = await StoreService.createStore(req.body, loggedAdmin);
            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getLogin(req, res, next) {
        try {
            const loggedAdmin = req.admin;
            if (loggedAdmin) {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: "Login successful",
                    admin: loggedAdmin
                });
            }       
            else {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Login failed"
                });
            }
        } catch (error) {
            next(error);
        }
    }
}


module.exports = new StoreController();
