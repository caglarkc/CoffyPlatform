const jwt = require('jsonwebtoken');
const { getRequestContext } = require('../../../../shared/middlewares/requestContext');
const { logger } = require('../../../../shared/utils/logger');

/**
 * Token, cookie veya request context'ten admin ID'yi çıkaran middleware
 * Admin ID'yi req.adminId olarak ekler
 */
const extractAdminIdMiddleware = async (req, res, next) => {
    try {
        let adminId;
        
        // 1. Öncelikle request nesnesine eklenmiş admin bilgisine bak
        if (req.admin && req.admin._id) {
            adminId = req.admin._id;
            logger.debug('Admin ID extracted from req.admin', { adminId });
        } 
        // 2. Token'dan admin ID'yi çıkarmayı dene
        else {
            let token = null;
            
            // Authorization header'dan veya cookie'den token'ı al
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
                logger.debug('Token extracted from Authorization header');
            } else if (req.cookies && req.cookies.accessToken) {
                token = req.cookies.accessToken;
                logger.debug('Token extracted from cookie');
            }
            
            if (token) {
                try {
                    const decoded = jwt.verify(token, process.env.SECRET_KEY);
                    adminId = decoded.userId;
                    logger.debug('Admin ID extracted from token', { adminId });
                } catch (tokenError) {
                    logger.warn('Token verification failed', { error: tokenError.message });
                    // Token hatalarında next() çağırarak devam ediyoruz
                    // Controller içinde ID kontrolü yapılacak
                }
            }
        }
        
        // 3. Admin ID bulunamadıysa requestContext'ten almayı dene
        if (!adminId) {
            const context = getRequestContext();
            adminId = context.userId;
            if (adminId) {
                logger.debug('Admin ID extracted from requestContext', { adminId });
            }
        }
        
        // Admin ID'yi req nesnesine ekle (bulunamazsa null olacak)
        req.adminId = adminId;
        
        // Middleware zincirinde devam et
        next();
    } catch (error) {
        logger.error('Error in extractAdminIdMiddleware', { 
            error: error.message, 
            stack: error.stack 
        });
        // Hata durumunda bile devam et, controller ID kontrolü yapacak
        next();
    }
};

module.exports = extractAdminIdMiddleware; 