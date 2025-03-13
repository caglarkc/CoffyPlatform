const User = require('../models/user.model');
const { validateUser } = require('../utils/validationUtils');

// Kullanıcı bilgilerini filtreleme yardımcı metodu
const _formatUserResponse = (user) => {
    return {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone
    };
};


class UserService {

    
    constructor() {
        this.user = User;
    }

    
}

module.exports = new UserService();
