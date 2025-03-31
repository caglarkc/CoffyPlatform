const errorMessages = require('../config/errorMessages');
const ValidationError = require('../utils/errors/ValidationError');

const validateName = (name) => {
    if (!name || name.length < 3 || name.length > 50) {
        throw new ValidationError(errorMessages.INVALID.INVALID_NAME);
    }
};

const validateStoreId = (storeId) => {
    if (!storeId || storeId.length > 4 || !/^[0-9]+$/.test(storeId)) {
        throw new ValidationError(errorMessages.INVALID.INVALID_STORE_ID);
    }
};

const validateLocation = (locationData) => {
    if (!locationData || locationData.length < 3 || locationData.length > 50) {
        throw new ValidationError(errorMessages.INVALID.INVALID_LOCATION);
    }
};



module.exports = {
    validateName,
    validateStoreId,
    validateLocation
};