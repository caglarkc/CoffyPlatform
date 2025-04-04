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
const { logger } = require('../../../../shared/utils/logger');
const eventPublisher = require('../../../../shared/services/event/eventPublisher');
const eventSubscriber = require('../../../../shared/services/event/eventSubscriber');
const dotenv = require('dotenv');
dotenv.config();

const _formatAdminResponse = (admin) => {
    return {
        id: admin._id,
        email: admin.email,
        phone: admin.phone,
        name: admin.name,
        surname: admin.surname,
        role: admin.role,
        location: admin.location,
        whoCreate: admin.whoCreate
    };
};


class AdminService {

    async testCommunication(testData) {
        try {
            logger.info('Testing communication with auth service', { testData });
            
            // Test verisi oluştur
            const requestData = {
                message: "Bu bir test mesajıdır",
                testData,
                timestamp: new Date().toISOString()
            };
            
            // Auth servisine istek gönder
            const response = await eventPublisher.request('admin.auth.testCommunication', requestData, {
                timeout: 10000
            });
            
            logger.info('Received response from auth service', { response });
            return {
                success: true,
                message: "Auth servisi ile iletişim testi",
                sentData: requestData,
                receivedResponse: response
            };
        } catch (error) {
            logger.error('Communication test with auth service failed', { 
                error: error.message, 
                stack: error.stack 
            });
            return {
                success: false,
                message: "Auth servisi ile iletişim testi başarısız",
                error: error.message
            };
        }
    }

    /**
     * Admin-auth servisinden admin bilgilerini al
     * @param {Object} adminData - Admin bilgisi veya ID (controller tarafından sağlanır)
     * @returns {Promise<Object>} - Admin bilgileri
     */
    async getAdmin(adminId) {
        try {
            // Admin ID'sini al
            
            if (!adminId) {
                throw new ValidationError(errorMessages.INVALID.INVALID_ID);
            }
            
            logger.info('Getting admin details from admin-auth service', { adminId });

            // Admin-auth servisine istek gönder
            const requestData = {
                adminId: adminId.toString(),
                timestamp: new Date().toISOString()
            };

            // Admin-auth servisine istek gönder
            const response = await eventPublisher.request('admin.auth.getAdmin', requestData, {
                timeout: 10000
            });
            
            if (!response.success) {
                logger.error('Failed to get admin details from auth service', { 
                    adminId,
                    error: response.message 
                });
                throw new NotFoundError(response.message || errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            logger.info('Received admin details from admin-auth service', { 
                adminId,
                success: response.success
            });
            
            return {
                success: true,
                message: successMessages.SEARCH.ADMIN_FOUND,
                admin: response.admin
            };
        } catch (error) {
            logger.error('Failed to get admin details', { 
                error: error.message, 
                stack: error.stack
            });
            throw error;
        }
    }

    async changeAdminDataMany(adminId, newData) {
        try {
            // Admin ID kontrolü
            if (!adminId) {
                throw new ValidationError(errorMessages.INVALID.INVALID_ID);
            }
            
            // newData kontrolü
            if (!newData || typeof newData !== 'object') {
                throw new ValidationError(errorMessages.INVALID.INVALID_DATA);
            }
            
            // En az bir alan güncellenmelidir
            const { name, surname, email, phone } = newData;
            if (!name && !surname && !email && !phone) {
                throw new ValidationError("En az bir bilgi alanı güncellenmelidir");
            }
            
            logger.info('Updating admin data from admin-auth service', { 
                adminId,
                fields: Object.keys(newData)
            });

            // Admin-auth servisine istek gönder
            const requestData = {
                adminId: adminId.toString(),
                newData: newData,
                timestamp: new Date().toISOString()
            };

            // Admin-auth servisine istek gönder
            const response = await eventPublisher.request('admin.auth.changeAdminDataMany', requestData, {
                timeout: 10000
            });
            
            if (!response.success) {
                logger.error('Failed to change admin data from auth service', { 
                    adminId,
                    error: response.message 
                });
                
                // Hata mesajından uygun hata tipini belirle ve fırlat
                if (response.error === 'ValidationError') {
                    throw new ValidationError(response.message);
                } else if (response.error === 'NotFoundError') {
                    throw new NotFoundError(response.message);
                } else if (response.error === 'ConflictError') {
                    throw new ConflictError(response.message);
                } else {
                    throw new Error(response.message || errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
                }
            }

            logger.info('Received admin data changed from admin-auth service', { 
                adminId,
                success: response.success
            });
            
            return {
                success: true,
                message: successMessages.UPDATE.ADMIN_DATA_UPDATED,
                admin: response.admin
            };
        } catch (error) {
            logger.error('Failed to change admin data', { 
                error: error.message, 
                stack: error.stack
            });
            throw error;
        }
    }


    async changeAdminDataJustOne(adminId, newData, type) {
        try {
            // Admin ID'sini al
            
            if (!adminId) {
                throw new ValidationError(errorMessages.INVALID.INVALID_ID);
            }

            if (!type) {
                throw new ValidationError(errorMessages.INVALID.INVALID_TYPE);
            }
            if (type !== 'name' && type !== 'surname' && type !== 'email' && type !== 'phone') {
                throw new ValidationError(errorMessages.INVALID.INVALID_TYPE_VALUE);
            }
            
            if (!newData) {
                throw new ValidationError(errorMessages.INVALID.EMPTY_DATA);
            }
            
            logger.info('Updating admin data from admin-auth service', { adminId });

            // Admin-auth servisine istek gönder
            const requestData = {
                adminId: adminId.toString(),
                newData: newData,
                type: type,
                timestamp: new Date().toISOString()
            };

            // Admin-auth servisine istek gönder
            const response = await eventPublisher.request('admin.auth.changeAdminDataJustOne', requestData, {
                timeout: 10000
            });
            
            if (!response.success) {
                logger.error('Failed to change admin data from auth service', { 
                    adminId,
                    error: response.message 
                });
                throw new NotFoundError(response.message || errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            logger.info('Received admin data changed from admin-auth service', { 
                adminId,
                success: response.success
            });
            
            return {
                success: true,
                message: successMessages.UPDATE.ADMIN_DATA_UPDATED,
                admin: response.admin
            };
        } catch (error) {
            logger.error('Failed to change admin data', { 
                error: error.message, 
                stack: error.stack
            });
            throw error;
        }
    

    }
    
    /**
     * Initialize event bus listeners for the admin service
     */
    async initializeEventListeners() {
        
    }
}

module.exports = new AdminService();