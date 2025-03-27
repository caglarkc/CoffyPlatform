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
            logger.warn('User already active', { email: userData.email });
            throw new ForbiddenError(errorMessages.FORBIDDEN.USER_ALREADY_ACTIVE);
        }
        if (isActive === 'blocked') {
            logger.warn('User blocked', { email: userData.email });
            throw new ForbiddenError(errorMessages.FORBIDDEN.USER_BLOCKED);
        }
        if (isActive === 'deleted') {
            logger.warn('User deleted', { email: userData.email });
            throw new ForbiddenError(errorMessages.FORBIDDEN.USER_DELETED);
        }
    }

    if (verificationTokenExpiresAt) {
        const timeSpace = verificationTokenExpiresAt - NOW();

        if (timeSpace > 4 * 60 * 1000) {
            logger.warn('Token cant send time', { email: userData.email });
            throw new TooManyRequestError(errorMessages.TOKEN.TOKEN_CANT_SEND_TIME);
        }
    }

    

};

const validateLoginToken = (isLoggedIn, loginTokenExpiresAt) => {
    if (isLoggedIn) {
        logger.warn('User already logged in', { email: userData.email });
        throw new ForbiddenError(errorMessages.FORBIDDEN.USER_ALREADY_LOGGED_IN);
    }
    if (loginTokenExpiresAt) {
        const timeSpace = loginTokenExpiresAt - NOW();
        if (timeSpace > 4 * 60 * 1000) {
            logger.warn('Token cant send time', { email: userData.email });
            throw new TooManyRequestError(errorMessages.TOKEN.TOKEN_CANT_SEND_TIME);
        }
    }
}

const validateUser = (user) => {
    if (!user) {
        logger.warn('User not found');
        throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
    }
    
}



const validateAdminRegister = (data) => {
    textUtils.validateName(data.name);
    textUtils.validateSurname(data.surname);
    textUtils.validateEmail(data.email);
    textUtils.validatePhone(data.phone);
    textUtils.validatePassword(data.password);
    textUtils.validateRole(data.role);
    //TODO: validate city, region, district, storeId
}


module.exports = {
    validateRegister,
    validateSendEmailVerifyToken,
    validateUser,
    validateLoginToken,
    validateAdminRegister
};
