const Admin = require('../models/admin.model');
const helpers = require('../utils/helpers');
const {validateAdminRegister, validateAdmin} = require('../utils/validationUtils');
const errorMessages = require('../config/errorMessages');
const successMessages = require('../config/successMessages');
const ConflictError = require('../utils/errors/ConflictError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const ValidationError = require('../utils/errors/ValidationError');
const redisService = require('./redis.service');
const tokenService = require('./token.service');
const tokenUtils = require('../utils/tokenUtils');
const { validateName , validateSurname ,validatePassword, validateRegister} = require('../utils/textUtils');
const jwt = require('jsonwebtoken');
const { getRedisClient } = require('../utils/database');
const { getRequestContext } = require('../middlewares/requestContext');


const ROLE_CODES = {
    Creator: 5,
    RegionAdmin: 4,
    CityAdmin: 3,
    DistrictAdmin: 2,
    StoreAdmin: 1,
    StoreWorker: 0
};

const _formatAdminResponse = (admin) => {
    return {
        id: admin._id,
        name: admin.name,
        surname: admin.surname,
        role: admin.role,
        city: admin.location.city,
        region: admin.location.region,
        district: admin.location.district,
        storeId: admin.location.storeId
    };
};

class AdminService {

    async checkCreator(email, password) {
        const isCreatorEmail = helpers.verifyCreatorEmail(email);
        const isCreatorPassword = helpers.verifyCreatorPassword(password);
    
        if (!isCreatorEmail || !isCreatorPassword) {
            return null; // Doğrudan null dön
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

    async registerAdmin(data) {
        try {
            const {creatorEmail, creatorPassword,  name, surname, email, phone, password, role, city, region, district, storeId} = data;
    
            const existingEmail = await Admin.findOne({email: email});
            const existingPhone = await Admin.findOne({phone: phone});
    
            console.log("creatorEmail:", creatorEmail);
            console.log("creatorPassword:", creatorPassword);
            if (existingEmail) {
                console.log("Email ile kayıtlı admin bulundu");
                throw new ConflictError(errorMessages.CONFLICT.EMAIL_ALREADY_EXISTS);
            }
    
            if (existingPhone) {
                console.log("Telefon ile kayıtlı admin bulundu");
                throw new ConflictError(errorMessages.CONFLICT.PHONE_ALREADY_EXISTS);
            }

            let admin = await this.checkCreator(creatorEmail, creatorPassword);

            if (!admin) {
                admin = await this.checkAdmin(email, password);
                if (!admin) {
                    throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
                }

                if (admin.role <= role) {
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
                    }
                });
                await newAdmin.save();
                
                const message = "Admin başarıyla oluşturuldu";
                return {message: message, 
                        admin: _formatAdminResponse(newAdmin)};
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
                }
            });
            await newAdmin.save();
            
            const message = "Admin başarıyla oluşturuldu";
            return {message: message, 
                    admin: _formatAdminResponse(newAdmin)};
            
        } catch (error) {
            console.log("error:", error);
            throw error;
        }

    }

    async loginAdmin(data) {
        try {
            const { email, password } = data;
    
            // Yöneticiyi kontrol et
            let admin = await this.checkCreator(email, password);
            if (!admin) {
                admin = await this.checkAdmin(email, password);
            }

            if (!admin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            // Redis'te token kontrolü
            const existRefreshToken = await redisService.get(`auth:refresh:${admin._id}`);

            if (existRefreshToken) {
                const existAccessToken = await redisService.get(`auth:access:${admin._id}`);
                if (existAccessToken) {
                    // Kullanıcı zaten giriş yapmış
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
                    // Yeni access token oluştur
                    const tokenPair = tokenService.createTokenPair(admin._id);
                    const accessToken = tokenPair.accessToken;

                    // Redis'e yeni access token'ı kaydet
                    await redisService.put(`auth:access:${admin._id}`, accessToken, 900); // 15 minutes

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

            return {
                message: successMessages.AUTH_SUCCESS.LOGIN_SUCCESS,
                admin: _formatAdminResponse(admin),
                tokenPair
            };
    
            
        } catch (error) {
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
                message: successMessages.AUTH_SUCCESS.TOKEN_REFRESHED,
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
            const {email, newRole } = data;
            const creatorEmail = loggedAdmin.email;
            if (!creatorEmail) {
                throw new NotFoundError("HATA1, önce giriş yap");
            }
            let admin = await this.checkCreator(creatorEmail, creatorPassword);
            if (!admin) {
                admin = await this.checkAdmin(creatorEmail, creatorPassword);
            }


            if (!admin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            if (admin.role <= newRole) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }

            const newAdmin = await Admin.findOne({email: email});
            if (!newAdmin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            newAdmin.role = newRole;
            await newAdmin.save();

            const message = "Rol başarıyla güncellendi";
            return {message: message, 
                    admin: _formatAdminResponse(newAdmin)};
            
            
            
        } catch (error) {
            throw error;
        }
    }

    async downgradeRole(data) {
        try {
            const { creatorEmail, creatorPassword, email, newRole } = data;
    
            let admin = await this.checkCreator(creatorEmail, creatorPassword);
            if (!admin) {
                admin = await this.checkAdmin(creatorEmail, creatorPassword);
            }


            if (!admin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            if (admin.role <= newRole) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
            }

            const newAdmin = await Admin.findOne({email: email});
            if (!newAdmin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.ADMIN_NOT_FOUND);
            }

            newAdmin.role = newRole;
            await newAdmin.save();

            const message = "Rol başarıyla güncellendi";
            return {message: message, 
                    admin: _formatAdminResponse(newAdmin)};
            
            
            
        } catch (error) {
            throw error;
        }
    }

    async deleteAdmin(creatorEmail, creatorPassword, email) {
        try {
            const admin = await Admin.findOne({email: email});
            if (!admin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
            }

            let isAllAccess = false;

            const creator = await Admin.findOne({"role.type": "Creator"});

            if (!creator) {
                throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
            }

            const isCreatorEmail = verifyCreaterData(creatorEmail, creator.email);

            if (isCreatorEmail) {
                const isCreatorPassword = verifyCreaterData(creatorPassword, creator.password);
                if (isCreatorPassword) {
                    isAllAccess = true;
                }
            }

            if (!isAllAccess) {
                const enteredAdmin = await Admin.findOne({email: creatorEmail});
                if (!enteredAdmin) {
                    throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
                }
                const isEnteredAdminPassword = verifyAdminData(creatorPassword, enteredAdmin.password);
                if (!isEnteredAdminPassword) {
                    throw new ForbiddenError(errorMessages.INVALID.INVALID_CREDENTIALS);
                }
                const level = enteredAdmin.role.code;
                if (level <= admin.role.code) {
                    throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
                }
            }

            await Admin.findByIdAndDelete(admin._id);

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
                message: successMessages.AUTH_SUCCESS.PHONE_CHECKED,
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
                message: successMessages.AUTH_SUCCESS.EMAIL_CHECKED,
                isExist: false
            };
        } catch (error) {
            throw error;
        }
    }

    async updateAdmin(requestBody) {
        try {
            // Validate user exists
            const admin = await Admin.findById(requestBody.adminId);
            validateAdmin(admin);
            
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
                        messageText += successMessages.AUTH_SUCCESS.PASSWORD_UPDATED + ' ';
                    } else {
                        fieldsUnchanged++;
                    }
                } catch (validationError) {
                    throw new ValidationError(errorMessages.INVALID.PASSWORD + ': ' + validationError.message);
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
                        messageText += successMessages.AUTH_SUCCESS.NAME_UPDATED + ' ';
                    } else {
                        fieldsUnchanged++;
                    }
                } catch (validationError) {
                    throw new ValidationError(errorMessages.INVALID.NAME + ': ' + validationError.message);
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
                        messageText += successMessages.AUTH_SUCCESS.SURNAME_UPDATED + ' ';
                    } else {
                        fieldsUnchanged++;
                    }
                } catch (validationError) {
                    throw new ValidationError(errorMessages.INVALID.SURNAME + ': ' + validationError.message);
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
                const updatedAdmin = await Admin.findById(requestBody.adminId);
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

    async changeLocation(creatorEmail, creatorPassword, email, location) {
        try {
            const admin = await Admin.findOne({email: email});
            if (!admin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
            }

            let isAllAccess = false;

            const creator = await Admin.findOne({"role.type": "Creator"});

            if (!creator) {
                throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
            }

            const isCreatorEmail = verifyCreaterData(creatorEmail, creator.email);

            if (isCreatorEmail) {
                const isCreatorPassword = verifyCreaterData(creatorPassword, creator.password);
                if (isCreatorPassword) {
                    isAllAccess = true;
                }
            }

            if (!isAllAccess) {
                const enteredAdmin = await Admin.findOne({email: creatorEmail});
                if (!enteredAdmin) {
                    throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
                }
                const isEnteredAdminPassword = verifyAdminData(creatorPassword, enteredAdmin.password);
                if (!isEnteredAdminPassword) {
                    throw new ForbiddenError(errorMessages.INVALID.INVALID_CREDENTIALS);
                }
                const level = enteredAdmin.role.code;
                if (level <= admin.role.code) {
                    throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
                }
            }

            admin.location = location;
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
            // Redis'ten tokenleri silme
            const redisClient = getRedisClient();
            await redisClient.del(`auth:access:${adminId}`);
            await redisClient.del(`auth:refresh:${adminId}`);
            
            return {
                message: successMessages.AUTH_SUCCESS.LOGOUT_SUCCESS,
                success: true
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AdminService();