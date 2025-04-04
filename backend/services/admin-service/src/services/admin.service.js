const Admin = require('../models/admin.model');
const helpers = require('../../../../shared/utils/helpers');
const errorMessages = require('../../../../shared/config/errorMessages');
const successMessages = require('../../../../shared/config/successMessages');
const ConflictError = require('../../../../shared/utils/errors/ConflictError');
const NotFoundError = require('../../../../shared/utils/errors/NotFoundError');
const ForbiddenError = require('../../../../shared/utils/errors/ForbiddenError');
const ValidationError = require('../../../../shared/utils/errors/ValidationError');
const redisService = require('../../../../shared/services/redis.service');
const tokenService = require('../../../../shared/services/token.service');
const { validateName , validateSurname ,validatePassword} = require('../../../../shared/utils/textUtils');
const { getRedisClient } = require('../utils/database');
const { getRequestContext } = require('../../../../shared/middlewares/requestContext');
const { logger } = require('../../../../shared/utils/logger');
const eventBus = require('../../../../shared/services/event/eventBus.service');



class AdminService {
    
    /**
     * Update an admin's name and publish event to admin-auth-service
     * @param {string} adminId - The ID of the admin to update
     * @param {string} name - The new name value
     * @returns {Object} - Result object with updated admin and message
     */
    async updateAdminName(adminId, name) {
        try {
            logger.info('Updating admin name', { adminId, name });
            
            if (!validateName(name)) {
                throw new ValidationError(errorMessages.INVALID.INVALID_NAME);
            }
            
            const admin = await Admin.findById(adminId);
            if (!admin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }
            
            admin.name = name;
            await admin.save();
            
            // Publish the name update event to admin-auth-service
            await this._publishEvent('admin.admin.nameUpdate', {
                adminId: admin._id.toString(),
                value: { name },
                timestamp: new Date().toISOString()
            });
            
            logger.info('Admin name updated successfully', { adminId });
            
            return {
                message: successMessages.UPDATE.ADMIN_NAME_UPDATED,
                admin: {
                    id: admin._id,
                    name: admin.name,
                    surname: admin.surname,
                    role: admin.role
                }
            };
        } catch (error) {
            logger.error('Error updating admin name', { 
                error: error.message, 
                stack: error.stack,
                adminId 
            });
            throw error;
        }
    }
    
    /**
     * Helper method to publish events through the event bus
     * @param {string} topic - Event topic
     * @param {Object} data - Event data
     * @private
     */
    async _publishEvent(topic, data) {
        try {
            logger.info('Publishing event', { topic, data: { ...data, adminId: data.adminId } });
            await eventBus.publish(topic, data);
            logger.info('Event published successfully', { topic });
        } catch (error) {
            logger.error('Failed to publish event', { 
                error: error.message, 
                stack: error.stack,
                topic 
            });
            // We don't throw here to prevent the main operation from failing
            // just because event publishing failed
        }
    }
    
    /**
     * Initialize event bus listeners for the admin service
     */
    async initializeEventListeners() {
        try {
            // This service primarily publishes events rather than consuming them
            // But can be expanded to listen to events from other services if needed
            logger.info('Admin service event publishers initialized');
        } catch (error) {
            logger.error('Failed to initialize event listeners', { 
                error: error.message, 
                stack: error.stack 
            });
        }
    }
}

module.exports = new AdminService();