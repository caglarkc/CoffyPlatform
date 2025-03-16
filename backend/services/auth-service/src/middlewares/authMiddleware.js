const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const redisService = require('../services/redis.service');
const { getRequestContext } = require('./requestContext');
const errorMessages = require('../config/errorMessages');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

/**
 * Admin kimlik doğrulama middleware'i
 * Token kontrolü yapar ve admin bilgilerini request nesnesine ekler
 */
const authAdminMiddleware = async (req, res, next) => {
    try {
        // Token'ı hem Authorization header'dan hem cookie'den almaya çalış
        let token = null;
        
        // 1. Authorization header'dan kontrol et
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } 
        // 2. Cookie'den kontrol et
        else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        
        // Token yoksa hata fırlat
        if (!token) {
            throw new UnauthorizedError(errorMessages.INVALID.TOKEN_REQUIRED);
        }
        
        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const adminId = decoded.userId;
        
        // Redis'ten token kontrolü
        const existingToken = await redisService.get(`auth:access:${adminId}`);
        if (!existingToken || existingToken !== token) {
            throw new UnauthorizedError(errorMessages.INVALID.INVALID_TOKEN);
        }
        
        // Admin bilgilerini veritabanından al
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new UnauthorizedError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
        }
        
        // Admin bilgilerini req nesnesine ekle
        req.admin = admin;
        
        // RequestContext'e de ekle (opsiyonel, farklı servislerde kullanım için)
        const context = getRequestContext();
        context.setUserId(admin._id);
        context.setData('adminRole', admin.role);
        context.setData('adminName', admin.name);
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: errorMessages.INVALID.INVALID_TOKEN 
            });
        }
        next(error);
    }
};

/**
 * Rol tabanlı yetkilendirme middleware'i
 * Belirli bir minimum role seviyesi gerektirir
 */
const authorizeAdmin = (minimumRole) => {
    return (req, res, next) => {
        try {
            // req.admin middleware zincirinde authAdminMiddleware'den geliyor
            if (!req.admin) {
                throw new UnauthorizedError(errorMessages.INVALID.NOT_AUTHENTICATED);
            }
            
            if (req.admin.role < minimumRole) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }
            
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    authAdminMiddleware,
    authorizeAdmin,
    ROLES: {
        CREATOR: 5,
        REGION_ADMIN: 4,
        CITY_ADMIN: 3,
        DISTRICT_ADMIN: 2,
        STORE_ADMIN: 1,
        STORE_WORKER: 0
    }
}; 