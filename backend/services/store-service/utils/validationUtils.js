const textUtils = require('./textUtils');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const errorMessages = require('../config/errorMessages');

const validateCreateStore = (data) => {
    textUtils.validateName(data.name);
    textUtils.validateStoreId(data.storeId);
    textUtils.validateLocation(data.region);
    textUtils.validateLocation(data.city);
    textUtils.validateLocation(data.district);
    
}

const validateAdminWithPermission = (admin, needLevel) => {
    if (!admin) {
        throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
    }
    if (admin.role < needLevel) {
        throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
    }
}

const validateAdmin = (admin) => {
    if (!admin) {
        throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
    }
}
module.exports = {
    validateCreateStore,
    validateAdminWithPermission,
    validateAdmin
}
