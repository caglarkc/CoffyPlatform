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
const { getRedisClient } = require('../utils/database');
const { getRequestContext } = require('../middlewares/requestContext');
const { logger } = require('../../../../shared/utils/logger');
const {validatePhone , validateEmail} = require('../../../../shared/utils/textUtils');
const {validateAdminRegister} = require('../../../../shared/utils/validationUtils');
const eventBus = require('../../../../shared/services/event/eventBus.service');
const dotenv = require('dotenv');
dotenv.config();

const _formatAdminResponse = (admin) => {
    return {
        id: admin._id,
        name: admin.name,
        surname: admin.surname,
        role: admin.role,
        location: admin.location,
        whoCreate: admin.whoCreate
    };
};


class AdminAuthService {
    
    async createCreator(key) {
        try {
            if (!key || key !== process.env.SECRET_KEY) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.INVALID_SECRET_KEY);
            }
            const name = "Ali Çağlar";
            const surname = "Koçer";
            const email = "alicaglarkocer@gmail.com";
            const phone = "5521791303";
            const password = "Erebus13032003_";

            const hashedEmail = helpers.hashCreaterData(email);
            const hashedPhone = helpers.hashCreaterData(phone);
            const hashedPassword = helpers.hashCreaterData(password);

            const creator = await Admin.create({
                name,
                surname,
                email: hashedEmail,
                phone: hashedPhone,
                password: hashedPassword,
                role: 5,
                status: "active",
                whoCreate: null,
                isLoggedIn: false
            });

            creator.save();

            const message = "Admin başarıyla oluşturuldu";
            return {
                message: message,
                admin: _formatAdminResponse(creator)
            };
            
            
        } catch (error) {
            throw error;
        }
    }

    async checkCreator(email, password) {
        const isCreatorEmail = helpers.verifyCreatorEmail(email);
        const isCreatorPassword = helpers.verifyCreatorPassword(password);

        if (!isCreatorEmail) {
            return null; // Doğrudan null dön
        }

        if (isCreatorEmail && !isCreatorPassword) {
            throw new ValidationError(errorMessages.INVALID.INVALID_CREDENTIALS);
        }


        const admin = await Admin.findOne({"role": 5});
        return admin; // Doğrudan admin nesnesini dön
    }

    async checkAdmin(email, password) {
        const admin = await Admin.findOne({email: helpers.hashAdminData(email)});
        if (!admin) {
            throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
        }
        const isPasswordCorrect = helpers.verifyAdminData(password, admin.password);
        if (!isPasswordCorrect) {
            throw new ForbiddenError(errorMessages.INVALID.INVALID_CREDENTIALS);
        }
        return admin; // Doğrudan admin nesnesini dön
    }



    async checkPhone(data) {
        try {
            const phone = data.phone;
            validatePhone(phone);
            
            const admin = await Admin.findOne({ phone: helpers.hashAdminData(phone) });
            if (admin) {
                throw new ConflictError(errorMessages.CONFLICT.PHONE_ALREADY_EXISTS);
            }
            return {
                message: successMessages.AUTH.PHONE_CHECKED,
                isExist: false
            };
        } catch (error) {
            throw error;
        }
    }

    async checkEmail(data) {
        try {
            const email = data.email;
            validateEmail(email);
            const admin = await Admin.findOne({ email: helpers.hashAdminData(email) });
            if (admin) {
                throw new ConflictError(errorMessages.CONFLICT.EMAIL_ALREADY_EXISTS);
            }
            return {
                message: successMessages.AUTH.EMAIL_CHECKED,
                isExist: false
            };
        } catch (error) {
            throw error;
        }
    }

    async createAdmin(data, loggedAdmin) {
        try {
            logger.info('Admin registration attempt', { 
                creatorId: loggedAdmin._id,
                creatorRole: loggedAdmin.role,
                newAdminEmail: data.email
            });
            
            const {name, surname, email, phone, password, role, city, region, district, storeId} = data;
            const existingEmail = await Admin.findOne({email: helpers.hashAdminData(email)});
            const existingPhone = await Admin.findOne({phone: helpers.hashAdminData(phone)});
    
            if (existingEmail) {
                logger.warn('Admin registration failed - email exists', { email });
                throw new ConflictError(errorMessages.CONFLICT.EMAIL_ALREADY_EXISTS);
            }
    
            if (existingPhone) {
                logger.warn('Admin registration failed - phone exists', { phone });
                throw new ConflictError(errorMessages.CONFLICT.PHONE_ALREADY_EXISTS);
            }

            validateAdminRegister(data, loggedAdmin.role);

            const newAdmin = new Admin({
                name,
                surname,
                email: helpers.hashAdminData(email),
                phone: helpers.hashAdminData(phone),
                password: helpers.hashAdminData(password),
                role: role,
                location: {
                    city,
                    region,
                    district,
                    storeId
                },
                whoCreate: loggedAdmin._id
            });
            await newAdmin.save();
            
            logger.info('Admin registered successfully', { 
                adminId: newAdmin._id,
                role: role,
                createdBy: loggedAdmin._id
            });
            
            const message = "Admin başarıyla oluşturuldu";
            return {message: message, 
                    admin: _formatAdminResponse(newAdmin)};
            
        } catch (error) {
            logger.error('Admin registration error', { 
                error: error.message, 
                stack: error.stack,
                creatorId: loggedAdmin?._id 
            });
            throw error;
        }

    }

    async loginAdmin(data) {
        try {
            logger.info('Admin login attempt', { email: data.email });
            
            const { email, password } = data;
    
            // Yöneticiyi kontrol et
            let admin = await this.checkCreator(email, password);
            if (!admin) {
                admin = await this.checkAdmin(email, password);
            }

            if (!admin) {
                logger.warn('Admin login failed - admin not found', { email });
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            if (admin.status === "blocked") {
                logger.warn('Admin login failed - admin is blocked', { adminId: admin._id });
                throw new ForbiddenError(errorMessages.FORBIDDEN.BLOCKED_ADMIN);
            }

            if (admin.status === "deleted") {
                logger.warn('Admin login failed - admin is deleted', { adminId: admin._id });
                throw new ForbiddenError(errorMessages.FORBIDDEN.DELETED_ADMIN);
            }

            // Redis'te token kontrolü
            const existRefreshToken = await redisService.get(`auth:refresh:${admin._id}`);

            if (existRefreshToken) {
                const existAccessToken = await redisService.get(`auth:access:${admin._id}`);
                if (existAccessToken) {
                    // Kullanıcı zaten giriş yapmış
                    logger.info('Admin already logged in', { adminId: admin._id });
                    return {
                        message: "Bu kullanıcı giriş yapmış, lütfen önce çıkış yapınız",
                        alreadyLoggedIn: true,
                        adminId: admin._id.toString(),
                        adminName: admin.name,
                        adminRole: admin.role
                    };
                } else {
                    // Access token süresi dolmuş ama refresh token geçerli
                    // Otomatik olarak yeni access token oluştur
                    const tokenPair = tokenService.createTokenPair(admin._id);
                    const accessToken = tokenPair.accessToken;

                    admin.isLoggedIn = true;
                    await admin.save();

                    // Redis'e yeni access token'ı kaydet
                    await redisService.put(`auth:access:${admin._id}`, accessToken, 900); // 15 minutes

                    
                    logger.info('Admin access token refreshed', { adminId: admin._id });
                    return {
                        message: "Oturumunuz yenilendi, yeni token oluşturuldu",
                        accessTokenRefreshed: true,
                        admin: _formatAdminResponse(admin),
                        accessToken: accessToken,
                        refreshToken: existRefreshToken
                    };
                }
            }

            // Yeni token çifti oluştur
            const tokenPair = tokenService.createTokenPair(admin._id);

            // Redis'e kaydet
            await redisService.put(`auth:access:${admin._id}`, tokenPair.accessToken, 900); // 15 minutes
            await redisService.put(`auth:refresh:${admin._id}`, tokenPair.refreshToken, 3600 * 7); // 7 hours

            // RequestContext güncelle
            const requestContext = getRequestContext();
            requestContext.setUserId(admin._id);
            requestContext.setData('adminRole', admin.role);
            requestContext.setData('adminName', admin.name);

            admin.isLoggedIn = true;
            await admin.save();
   
            
            logger.info('Admin logged in successfully', { adminId: admin._id, role: admin.role });

            return {
                message: successMessages.AUTH.LOGIN_SUCCESS,
                admin: _formatAdminResponse(admin),
                tokenPair
            };
    
            
        } catch (error) {
            logger.error('Admin login error', { 
                error: error.message, 
                stack: error.stack,
                email: data?.email 
            });
            throw error;
        }
    }
    
    //en son burada kaldım kontrol kısmında, devam et buradan aşagıya dogru kontrol edi düzenlemeye
    async deleteAdmin(loggedAdmin, email) {
        try {
            if (!loggedAdmin) {
                throw new ForbiddenError("burada bir hata var knk");
            }

            const admin = await Admin.findOne({email: email});
            if (!admin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            if (loggedAdmin.role <= admin.role || loggedAdmin._id.toString() === admin._id.toString()) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }

            if (admin.status === "deleted") {
                throw new ForbiddenError(errorMessages.FORBIDDEN.ALREADY_DELETED);
            }

            admin.status = "deleted";
            await admin.save();

            const message = "Admin başarıyla silindi";
            return {message: message};

        } catch (error) {
            throw error;
        }
    }

    //çıkış yaomayı deneyen, zaten giriş ypamış admin ile çıkış yapmayı deneyen id aynı mı kontrol et!
    async logoutAdmin(adminId) {
        try {
            logger.info('Admin logout attempt', { adminId });
            
            // Redis'ten tokenleri silme
            const redisClient = getRedisClient();
            await redisClient.del(`auth:access:${adminId}`);
            await redisClient.del(`auth:refresh:${adminId}`);
            
            const admin = await Admin.findById(adminId);
            if (admin) {
                admin.isLoggedIn = false;
                await admin.save();
            } else {
                logger.warn('Admin logout - admin not found in database', { adminId });
            }
            
            
            logger.info('Admin logged out successfully', { adminId });

            return {
                message: successMessages.AUTH.LOGOUT_SUCCESS,
                success: true
            };
        } catch (error) {
            logger.error('Admin logout error', { 
                error: error.message, 
                stack: error.stack,
                adminId
            });
            throw error;
        }
    }

    async getAdmin(adminData) {
        try {
            const admin = await Admin.findById(adminData._id);
            if (!admin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            return {
                message: successMessages.SEARCH.ADMIN_FOUND,
                admin: _formatAdminResponse(admin)
            };
        } catch (error) {
            throw error;
        }
    }


    async createCreator() {
        try {
            const name = "Ali Çağlar";
            const surname = "Koçer";
            const email = "alicaglarkocer@gmail.com";
            const phone = "5521791303";
            const password = "Erebus13032003_";

            const hashedEmail = helpers.hashCreaterData(email);
            const hashedPhone = helpers.hashCreaterData(phone);
            const hashedPassword = helpers.hashCreaterData(password);

            const creator = await Admin.create({
                name,
                surname,
                email: hashedEmail,
                phone: hashedPhone,
                password: hashedPassword,
                role: 5,
                status: "active",
                whoCreate: null,
                isLoggedIn: false
            });

            return creator;
            
        } catch (error) {
            throw error;
        }
    }


    // EventBus başlatma ve olay yayınlama metotları
    async initializeEventListeners() {
        try {
            // Servis başladığında kalıcı kuyruklar ile olay dinleme
            const queueNamePrefix = 'admin-auth-service.queue';
            
            // Admin servisinden gelen olayları dinle
            await eventBus.subscribe('admin.admin.*', this._handleAdminEvents.bind(this), {
                queueName: `${queueNamePrefix}.admin-events`,
                durable: true
            });
            
            
            logger.info('Admin-Auth service event listeners initialized');
        } catch (error) {
            logger.error('Failed to initialize event listeners', { error: error.message, stack: error.stack });
        }
    }

    // Admin servisinden gelen olayları işleyen metot
    async _handleAdminEvents(data, metadata) {
        try {
            logger.info('Received admin event', { topic: metadata.topic, adminId: data.adminId });
            
            // Admin güncelleme olaylarını işle
            if (metadata.topic === 'admin.admin.nameUpdate') {



                const { adminId, value } = data;
                
                // Admin profil verilerini güncelle
                const admin = await Admin.findById(adminId);
                if (admin) {
                    // Sadece izin verilen alanları güncelle
                    if (value.name) admin.name = value.name;
                    
                    await admin.save();
                    logger.info('Admin name updated from event', { adminId });
                }
            }
            
        } catch (error) {
            logger.error('Error handling admin event', { error: error.message, data, metadata });
        }
    }

/*   
    // Store servisinden gelen olayları işleyen metot
    async _handleStoreEvents(data, metadata) {
        try {
            logger.info('Received store event', { topic: metadata.topic, storeId: data.storeId });
            
            // Admin-store ilişkisi değişikliklerini işle
            if (metadata.topic === 'store.admin.assigned') {
                const { adminId, storeId, location } = data;
                
                // Admin lokasyonunu güncelle
                const admin = await Admin.findById(adminId);
                if (admin) {
                    admin.location = {
                        ...admin.location,
                        storeId,
                        ...(location || {})
                    };
                    await admin.save();
                    logger.info('Admin store assignment updated from event', { adminId, storeId });
                }
            }
        } catch (error) {
            logger.error('Error handling store event', { error: error.message, data, metadata });
        }
    }
*/





    

    // Refresh token ile yeni access token oluşturma metodu
    async refreshAccessToken(adminId, refreshToken) {
        try {
            // Redis'ten refresh token kontrolü
            const storedRefreshToken = await redisService.get(`auth:refresh:${adminId}`);
            
            if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
                throw new ForbiddenError(errorMessages.INVALID.INVALID_REFRESH_TOKEN);
            }

            // Yeni access token oluştur
            const tokenPair = tokenService.createTokenPair(adminId);
            const accessToken = tokenPair.accessToken;

            // Redis'e yeni access token'ı kaydet
            await redisService.put(`auth:access:${adminId}`, accessToken, 900); // 15 minutes


            return {
                message: successMessages.AUTH.TOKEN_REFRESHED,
                accessToken: accessToken,
                expiresAt: new Date(Date.now() + 900 * 1000).toISOString()
            };
        } catch (error) {
            throw error;
        }
    }

    async getRefreshToken(adminId) {
        try {
            return await redisService.get(`auth:refresh:${adminId}`);
        } catch (error) {
            throw error;
        }
    }

}



module.exports = new AdminAuthService();