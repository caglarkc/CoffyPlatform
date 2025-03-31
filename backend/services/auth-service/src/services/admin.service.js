const User = require('../models/user.model');
const Admin = require('../../../../shared/models/admin.model');
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

const _formatAdminResponse = (admin) => {
    return {
        id: admin._id,
        name: admin.name,
        surname: admin.surname,
        role: admin.role,
        city: admin.location.city,
        region: admin.location.region,
        district: admin.location.district,
        storeId: admin.location.storeId,
        whoCreate: admin.whoCreate
    };
};


class AdminService {

    async checkCreator(email, password) {
        const isCreatorEmail = helpers.verifyCreatorEmail(email);
        const isCreatorPassword = helpers.verifyCreatorPassword(password);

        if (!isCreatorEmail && !isCreatorPassword) {
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


    async registerAdmin(data, loggedAdmin) {
        try {
            logger.info('Admin registration attempt', { 
                creatorId: loggedAdmin._id,
                creatorRole: loggedAdmin.role,
                newAdminEmail: data.email
            });
            
            const {name, surname, email, phone, password, role, city, region, district, storeId} = data;
    
            const existingEmail = await Admin.findOne({email: email});
            const existingPhone = await Admin.findOne({phone: phone});
    
            if (existingEmail) {
                logger.warn('Admin registration failed - email exists', { email });
                throw new ConflictError(errorMessages.CONFLICT.EMAIL_ALREADY_EXISTS);
            }
    
            if (existingPhone) {
                logger.warn('Admin registration failed - phone exists', { phone });
                throw new ConflictError(errorMessages.CONFLICT.PHONE_ALREADY_EXISTS);
            }

            const adminRole = loggedAdmin.role;

            if (adminRole <= role) {
                logger.warn('Admin registration failed - insufficient permissions', { 
                    creatorRole: adminRole, 
                    attemptedRole: role 
                });
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }

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

    async upgradeRole(data, loggedAdmin) {
        try {
            logger.info('Admin role upgrade attempt', { 
                adminId: loggedAdmin._id,
                adminRole: loggedAdmin.role,
                targetEmail: data.email,
                newRole: data.newRole
            });
            
            const { email, newRole } = data;

            // Yetki kontrolü - sadece admin bilgilerini alıp geri kalan kontrolü kullanıcı ekleyecek
            const adminRole = loggedAdmin.role;
            const adminId = loggedAdmin._id;
            
            // İşlemin hedefi olan admin'i bul
            const targetAdmin = await Admin.findOne({email: helpers.hashAdminData(email)});
            if (!targetAdmin) {
                logger.warn('Admin role upgrade failed - target admin not found', { email });
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            if (adminRole <= newRole) {
                logger.warn('Admin role upgrade failed - insufficient permissions', { 
                    adminRole,
                    targetRole: newRole,
                    adminId,
                    targetAdminId: targetAdmin._id
                });
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }

            // Rol güncelleme
            const oldRole = targetAdmin.role;
            targetAdmin.role = newRole;
            await targetAdmin.save();
            
            logger.info('Admin role upgraded successfully', { 
                targetAdminId: targetAdmin._id,
                oldRole,
                newRole,
                updatedBy: adminId
            });

            return {
                message: "Rol başarıyla güncellendi", 
                admin: _formatAdminResponse(targetAdmin),
                updatedBy: {
                    adminId: adminId,
                    role: adminRole
                }
            };
        } catch (error) {
            logger.error('Admin role upgrade error', { 
                error: error.message, 
                stack: error.stack,
                adminId: loggedAdmin?._id,
                targetEmail: data?.email
            });
            throw error;
        }
    }

    async downgradeRole(data, loggedAdmin) {
        try {
            const { email, newRole } = data;

            // Yetki kontrolü - sadece admin bilgilerini alıp geri kalan kontrolü kullanıcı ekleyecek
            const adminRole = loggedAdmin.role;
            const adminId = loggedAdmin._id;
            
            // İşlemin hedefi olan admin'i bul
            const targetAdmin = await Admin.findOne({email: helpers.hashAdminData(email)});
            if (!targetAdmin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            // Rol güncelleme
            targetAdmin.role = newRole;
            await targetAdmin.save();

            return {
                message: "Rol başarıyla güncellendi", 
                admin: _formatAdminResponse(targetAdmin),
                updatedBy: {
                    adminId: adminId,
                    role: adminRole
                }
            };
        } catch (error) {
            throw error;
        }
    }

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

    async checkPhone(phone) {
        try {
            const admin = await Admin.findOne({ phone });
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

    async checkEmail(email) {
        try {
            const admin = await Admin.findOne({ email });
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

    async updateAdmin(requestBody, loggedAdmin) {
        try {
            if (!loggedAdmin) {
                throw new ForbiddenError("burada bir hata var knk");
            }

            const admin = await Admin.findOne({email: loggedAdmin.email});




            
            // Check if all values are 'default' - no actual updates requested
            const allDefault = requestBody.password === 'default' && 
                             requestBody.name === 'default' && 
                             requestBody.surname === 'default';
            
            if (allDefault) {
                throw new ValidationError(errorMessages.INVALID.NO_INFORMATION_PROVIDED);
            }

            // Track update status
            let isUpdated = false;
            let messageText = '';
            let fieldsChecked = 0;
            let fieldsUnchanged = 0;
            
            // Password validation and update
            if (requestBody.password && requestBody.password !== 'default') {
                fieldsChecked++;
                try {
                    validatePassword(requestBody.password);
                    const hashedPassword = hashAdminData(requestBody.password);
                    if (admin.password !== hashedPassword) {
                        admin.password = hashedPassword;
                        isUpdated = true;
                        messageText += successMessages.UPDATE.PASSWORD_UPDATED + ' ';
                    } else {
                        fieldsUnchanged++;
                    }
                } catch (validationError) {
                    throw new ValidationError(errorMessages.INVALID.INVALID_PASSWORD + ': ' + validationError.message);
                }
            }
    
            // Name validation and update
            if (requestBody.name && requestBody.name !== 'default') {
                fieldsChecked++;
                try {
                    validateName(requestBody.name);
                    if (admin.name !== requestBody.name) {
                        admin.name = requestBody.name;
                        isUpdated = true;
                        messageText += successMessages.UPDATE.NAME_UPDATED + ' ';
                    } else {
                        fieldsUnchanged++;
                    }
                } catch (validationError) {
                    throw new ValidationError(errorMessages.INVALID.INVALID_NAME + ': ' + validationError.message);
                }
            }
    
            // Surname validation and update
            if (requestBody.surname && requestBody.surname !== 'default') {
                fieldsChecked++;
                try {
                    validateSurname(requestBody.surname);
                    if (admin.surname !== requestBody.surname) {
                        admin.surname = requestBody.surname;
                        isUpdated = true;
                        messageText += successMessages.UPDATE.SURNAME_UPDATED + ' ';
                    } else {
                        fieldsUnchanged++;
                    }
                } catch (validationError) {
                    throw new ValidationError(errorMessages.INVALID.INVALID_SURNAME + ': ' + validationError.message);
                }
            }

            // Check if any fields were provided for update
            if (fieldsChecked === 0) {
                throw new ValidationError(errorMessages.INVALID.NO_INFORMATION_PROVIDED);
            }

            // Check if all provided values are the same as current values
            if (fieldsChecked > 0 && fieldsChecked === fieldsUnchanged) {
                throw new ValidationError(errorMessages.INVALID.ALL_VALUES_SAME);
            }
    
            // Save changes if any updates were made
            if (isUpdated) {
                await admin.save();
                const updatedAdmin = await Admin.findById(admin._id);
                return {
                    message: messageText.trim(),
                    admin: _formatAdminResponse(updatedAdmin),
                    success: true
                };
            } else {
                // This should not happen with the above checks, but keeping as a fallback
                return {
                    message: errorMessages.INVALID.NO_UPDATE,
                    admin: _formatAdminResponse(admin),
                    success: false
                };
            }
        } catch (error) {
            // Enhance error with more context if needed
            if (error instanceof ValidationError || 
                error instanceof ConflictError || 
                error instanceof ForbiddenError) {
                throw error;
            } else {
                // For unexpected errors, provide a generic message but log the actual error
                console.error('Error in updateAdmin:', error);
                throw new Error(errorMessages.INTERNAL.SERVER_ERROR);
            }
        }
    }

    async changeLocation(requestBody, loggedAdmin) {
        try {
            if (!loggedAdmin) {
                throw new ForbiddenError("burada bir hata var knk");
            }

            const {city, region, district, storeId} = requestBody.location;

            const admin = await Admin.findOne({email: loggedAdmin.email});

            admin.location = {
                city,
                region,
                district,
                storeId
            };
            await admin.save();

            const message = "Konum başarıyla güncellendi";
            return {message: message, admin: _formatAdminResponse(admin)};

        } catch (error) {
            throw error;
        }
    }

    // Çıkış yapma metodu - tokenleri geçersiz kılma
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


    async getUsers(loggedAdmin) {
        try {
            if (!loggedAdmin) {
                throw new ForbiddenError("burada bir hata var knk");
            }

            const role = loggedAdmin.role;

            if (role < 3) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }

            const users = await User.find({});
            return {
                message: successMessages.SEARCH.USER_FOUND,
                users: users
            };
            
        } catch (error) {
            throw error;
        }
    }

    async getUsersWithUniqueData(data, loggedAdmin) {
        try {
            if (!loggedAdmin) {
                throw new ForbiddenError("burada bir hata var knk");
            }

            const role = loggedAdmin.role;

            if (role < 3) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }

            const { type } = data;
            
            // Geçerli type değerleri kontrolü
            const validFields = ['name', 'surname', 'email', 'phone', 'isActive', 'isLoggedIn', 'lastLoginAt'];
            if (!type || !validFields.includes(type)) {
                throw new ValidationError(`Geçersiz type değeri. Geçerli değerler: ${validFields.join(', ')}`);
            }

            const users = await User.find({});
            
            // Dinamik olarak sadece istenen alanı ve _id'yi içeren nesneler oluştur
            const filteredUsers = users.map(user => {
                const result = { _id: user._id };
                result[type] = user[type]; // İstenen alanı dinamik olarak ekle
                return result;
            });

            return {
                message: successMessages.SEARCH.USER_FOUND,
                users: filteredUsers
            };
        } catch (error) {
            throw error;
        }
    }

    async filterUsers(data, loggedAdmin) {
        try {
            if (!loggedAdmin) {
                throw new ForbiddenError("burada bir hata var knk");
            }

            const role = loggedAdmin.role;

            if (role < 3) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }

            const { type , value } = data;
            
            // filter parametresi zorunlu
            if (!type || typeof type !== 'string' || type.trim() === '') {
                throw new ValidationError("Filtreleme için type belirtmelisiniz. Örnek: {type: 'name', value: 'Ali'}");
            }
            
            // Geçerli filtreleme alanlarını kontrol et
            const validFilterFields = ['name', 'surname', 'email', 'phone', 'isActive', 'isLoggedIn'];
            
            if (!validFilterFields.includes(type)) {
                throw new ValidationError(
                    `Geçersiz filtreleme alanı: ${type}. Geçerli alanlar: ${validFilterFields.join(', ')}`
                );
            }
            
            // MongoDB sorgusu için filtreleme nesnesini oluştur
            const query = {};
            query[type] = value;
            
            // Örnek: filter={name: "Ali", isActive: true} için 
            // User.find({name: "Ali", isActive: true}) çalışacak
            const users = await User.find(query);

            return {
                message: successMessages.SEARCH.USER_FOUND,
                count: users.length,
                users: users
            };
        } catch (error) {
            throw error;
        }
    }

    async blockUser(data, loggedAdmin) {
        try {
            if (!loggedAdmin) {
                throw new ForbiddenError("burada bir hata var knk");
            }

            const role = loggedAdmin.role;

            if (role < 3) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }

            const { userId, adminMessage } = data;
            const user = await User.findById(userId);
            if (!user) {
                throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
            }

            user.status = "blocked";
            user.adminMessage = loggedAdmin.name + " " + loggedAdmin.surname + " mesajı: " + adminMessage;
            await user.save();

            return {
                message: successMessages.UPDATE.USER_BLOCKED,
                user: _formatUserResponse(user)
            };
            
        } catch (error) {
            throw error;
        }
    }


    async deleteUser(data, loggedAdmin) {
        try {
            if (!loggedAdmin) {
                throw new ForbiddenError("burada bir hata var knk");
            }

            const role = loggedAdmin.role;

            if (role < 3) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }

            const { userId, adminMessage } = data;
            const user = await User.findById(userId);
            if (!user) {
                throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
            }

            user.status = "deleted";
            user.adminMessage = loggedAdmin.name + " " + loggedAdmin.surname + " mesajı: " + adminMessage;
            await user.save();

            return {
                message: successMessages.UPDATE.USER_DELETED,
                user: _formatUserResponse(user)
            };
            
        } catch (error) {
            throw error;
        }
    }

    async getAdminProfile(loggedAdmin) {
        try {
            const admin = await Admin.findById(loggedAdmin._id);
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
}

module.exports = new AdminService();