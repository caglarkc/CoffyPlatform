const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const redisService = require('../services/redis.service');
const { getRequestContext } = require('./requestContext');


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
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Yetkilendirme hatası: Oturum açmanız gerekiyor",
                details: "Bu işlemi gerçekleştirmek için önce giriş yapmalısınız",
                type: "AUTH_REQUIRED",
                timestamp: new Date().toISOString()
            });
        }
        
        // Token'ı doğrula
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const adminId = decoded.userId;
            
            // Redis'ten token kontrolü
            const existingToken = await redisService.get(`auth:access:${adminId}`);
            if (!existingToken || existingToken !== token) {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Geçersiz veya süresi dolmuş oturum",
                    details: "Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.",
                    type: "INVALID_SESSION",
                    timestamp: new Date().toISOString()
                });
            }
            
            // Admin bilgilerini veritabanından al
            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Yönetici bulunamadı",
                    details: "Bu token ile ilişkili yönetici hesabı bulunamadı",
                    type: "ADMIN_NOT_FOUND",
                    timestamp: new Date().toISOString()
                });
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
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Oturum süresi doldu",
                    details: "Erişim tokenınızın süresi doldu. Lütfen tekrar giriş yapın veya tokenı yenileyin.",
                    type: "TOKEN_EXPIRED",
                    timestamp: new Date().toISOString()
                });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Geçersiz token formatı",
                    details: "Sağlanan token geçersiz bir formatta. Lütfen tekrar giriş yapın.",
                    type: "INVALID_TOKEN_FORMAT",
                    timestamp: new Date().toISOString()
                });
            } else {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Kimlik doğrulama hatası",
                    details: error.message,
                    type: "AUTH_ERROR",
                    timestamp: new Date().toISOString()
                });
            }
        }
    } catch (error) {
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
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Kimlik doğrulaması yapılmadı",
                    details: "Bu işlemi yapmadan önce giriş yapmanız gerekiyor",
                    type: "NOT_AUTHENTICATED",
                    timestamp: new Date().toISOString()
                });
            }
            
            if (req.admin.role < minimumRole) {
                return res.status(403).json({
                    success: false,
                    status: 403,
                    message: "Yetersiz yetki seviyesi",
                    details: "Bu işlemi gerçekleştirmek için yeterli yetkiye sahip değilsiniz",
                    type: "INSUFFICIENT_PERMISSIONS",
                    timestamp: new Date().toISOString()
                });
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