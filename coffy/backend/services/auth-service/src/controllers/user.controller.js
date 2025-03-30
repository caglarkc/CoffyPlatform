const UserService = require('../services/user.service');

class UserController {
    constructor() {
        this.userService = UserService;
    }

    async getUser(req, res, next) {
        const { userId } = req.query;
        const message = await this.userService.getUser(userId);
        return res.status(200).json(message);
    }
}

module.exports = new UserController();
