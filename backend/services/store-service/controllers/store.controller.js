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


}


module.exports = new StoreController();
