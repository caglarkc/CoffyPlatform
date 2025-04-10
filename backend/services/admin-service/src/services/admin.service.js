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


    /**
     * Hata durumlarını yönetmek için yardımcı metod
     * @param {Error} error - Yakalanan hata
     * @param {Object} res - Express response object
     * @param {String} errorMessage - Kullanıcıya gösterilecek hata mesajı
     * @param {Number} defaultStatusCode - Varsayılan HTTP durum kodu (isteğe bağlı, varsayılan 500)
     * @returns {Object} HTTP yanıtı
     */
    _handleError(error, errorMessage) {
        
        // Hatayı logla
        logger.error(errorMessage, { 
            error: error.message, 
            stack: error.stack
        });

        throw error;
    }

    _handleErrorWithType(response, adminId, errorMessage) {

        logger.error(errorMessage, { 
            adminId,
            error: response.message 
        });

        if (response.error === 'ValidationError') {
            throw new ValidationError(errorMessage);
        } else if (response.error === 'NotFoundError') {
            throw new NotFoundError(errorMessage);
        } else if (response.error === 'ConflictError') {
            throw new ConflictError(errorMessage);
        } else {
            throw new Error(errorMessage);
        }        
        
    }

    _handleSuccess(logMessage,successMessage, data) {

        logger.info(logMessage, { 
            data,
            success: true
        });

        return {
            success: true,
            message: successMessage,
            data: data
        };
    }

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
            this._handleError(error, "Auth servisi ile iletişim testi başarısız");
        }
    }

    async getMe(adminId) {
        try {
            logger.info('Getting admin details from admin-auth service', { adminId });

            // Admin-auth servisine istek gönder
            const requestData = {
                adminId: adminId.toString(),
                timestamp: new Date().toISOString()
            };

            // Admin-auth servisine istek gönder
            const response = await eventPublisher.request('admin.auth.getMe', requestData, {
                timeout: 10000
            });
            
            if (!response.success) {
                this._handleErrorWithType(response, adminId, "Admin detayları alınamadı");
            } 

            return this._handleSuccess('Received admin details from admin-auth service',successMessages.SEARCH.ADMIN_FOUND, response.admin);
        } catch (error) {
            this._handleError(error, "Admin detayları alınamadı");
        }
    }

    async changeAdminDataMany(adminId, newData) {
        try {
            
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
                this._handleErrorWithType(response, adminId, "Admin bilgileri güncellenemedi");
            }

            return this._handleSuccess('Admin bilgileri admin-auth servisinde güncellendi',successMessages.UPDATE.ADMIN_DATA_UPDATED, response.admin);
        } catch (error) {
            this._handleError(error, "Admin bilgileri güncellenemedi");
        }
    }


    async changeAdminDataJustOne(adminId, newData, type) {
        try {
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
                this._handleErrorWithType(response, adminId, "Admin bilgileri güncellenemedi");
            }

            return this._handleSuccess('Admin bilgileri admin-auth servisinde güncellendi',successMessages.UPDATE.ADMIN_DATA_UPDATED, response.admin);
        } catch (error) {
            this._handleError(error, "Admin bilgileri güncellenemedi");
        }
    

    }
    

    async changeLocation(adminId, location) {
        try {
            logger.info('Updating admin location from admin-auth service', { adminId });

            // Admin-auth servisine istek gönder
            const requestData = {
                adminId: adminId.toString(),
                location: location,
                timestamp: new Date().toISOString()
            };

            // Admin-auth servisine istek gönder
            const response = await eventPublisher.request('admin.auth.changeLocation', requestData, {
                timeout: 10000
            });
            
            if (!response.success) {
                this._handleErrorWithType(response, adminId, "Admin konumu güncellenemedi");
            }

            return this._handleSuccess('Admin konumu admin-auth servisinde güncellendi',successMessages.UPDATE.ADMIN_LOCATION_UPDATED, response.admin);

        } catch (error) {
            this._handleError(error, "Admin konumu güncellenemedi");
        }
    
    }

    async deleteMe(adminId) {
        try {
            logger.info('Deleting admin from admin-auth service', { adminId });

            // Admin-auth servisine istek gönder
            const requestData = {
                adminId: adminId.toString(),
                timestamp: new Date().toISOString()
            };

            // Admin-auth servisine istek gönder
            const response = await eventPublisher.request('admin.auth.deleteMe', requestData, {
                timeout: 10000
            });

            if (!response.success) {
                this._handleErrorWithType(response, adminId, "Admin silinemedi");
            }

            return this._handleSuccess('Admin silindi',successMessages.DELETE.ADMIN_DELETED, response.admin);

        } catch (error) {
            this._handleError(error, "Admin silinemedi");
        }
    }

    





    /**
     * Initialize event bus listeners for the admin service
     */
    async initializeEventListeners() {
        
    }
}

module.exports = new AdminService();