const textUtils = require('./textUtils');
const ForbiddenError = require('./errors/ForbiddenError');
const errorMessages = require('../config/errorMessages');
const TooManyRequestError = require('./errors/TooManyRequestError');
const NotFoundError = require('./errors/NotFoundError');
const { NOW } = require('./constants/time');

const validateRegister = (userData) => {
    textUtils.validateName(userData.name);
    textUtils.validateSurname(userData.surname);
    textUtils.validateEmail(userData.email);
    textUtils.validatePhone(userData.phone);
    textUtils.validatePassword(userData.password);
    
};

const validateSendEmailVerifyToken = (isActive, verificationTokenExpiresAt) => {

    if (isActive !== "notVerified") {
        if (isActive === 'active') {
            throw new ForbiddenError(errorMessages.FORBIDDEN.USER_ALREADY_ACTIVE);
        }
        if (isActive === 'blocked') {
            throw new ForbiddenError(errorMessages.FORBIDDEN.USER_BLOCKED);
        }
        if (isActive === 'deleted') {
            throw new ForbiddenError(errorMessages.FORBIDDEN.USER_DELETED);
        }
    }

    if (verificationTokenExpiresAt) {
        const timeSpace = verificationTokenExpiresAt - NOW();

        if (timeSpace > 4 * 60 * 1000) {
            throw new TooManyRequestError(errorMessages.TOKEN.TOKEN_CANT_SEND_TIME);
        }
    }

    

};

const validateUser = (user) => {
    if (!user) {
        throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
    }
    
}

module.exports = {
    validateRegister,
    validateSendEmailVerifyToken,
    validateUser
};
