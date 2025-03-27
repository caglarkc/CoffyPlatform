const Store = require('../models/store.model');
const Admin = require('../models/admin.model');
const validationUtils = require('../utils/validationUtils');
const ConflictError = require('../utils/errors/ConflictError');
const errorMessages = require('../config/errorMessages');
const successMessages = require('../config/successMessages');
const logger = require('winston');

class StoreService {

    async createStore(data, loggedAdmin, next) {
        try {
            const admin = await Admin.findById(loggedAdmin._id);
            validationUtils.validateAdminWithPermission(admin);
            validationUtils.validateCreateStore(data);
            const storeId = data.storeId;
            const existStore = await Store.findOne({storeId});
            if (existStore) {
                throw new ConflictError(errorMessages.CONFLICT.STOREID_ALREADY_EXISTS);
            }

            const name = data.name;
            const region = data.region;
            const city = data.city;
            const district = data.district;
            const location = {region, city, district};
            const workers = [];
            const status = 'active';

            const store = await Store.create({name, storeId, location, workers, status});
            
            const message = {
                message: successMessages.STORE.STORE_CREATED,
                storeId: store.storeId
            }
            
            return message;
        } catch (error) {
            logger.error('Store creation error', { 
                error: error.message, 
                stack: error.stack,
                creatorId: loggedAdmin?._id 
            });
            throw error;
        }
    }


}

module.exports = new StoreService();
