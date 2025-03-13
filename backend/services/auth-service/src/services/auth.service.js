const User = require('../models/user.model');
const nodemailer = require('nodemailer');
const { generateCode , hashCode , verifyHashedCode , hashPassword , verifyPassword } = require('../utils/helpers');
const { createLog } = require('./log.service');
const { NOW, FORMAT_EXPIRES_AT } = require('../utils/constants/time');
const { validateRegister , validateSendEmailVerifyToken , validateUser, validateLoginToken } = require('../utils/validationUtils');
const { validateName , validateSurname , validatePassword , validateEmail , validatePhone } = require('../utils/textUtils');
const errorMessages = require('../config/errorMessages');
const ConflictError = require('../utils/errors/ConflictError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const ValidationError = require('../utils/errors/ValidationError');
const successMessages = require('../config/successMessages');
const { getRedisClient } = require('../utils/database');


// Kullanıcı bilgilerini filtreleme yardımcı metodu
const _formatUserResponse = (user) => {
    return {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone
    };
};


class AuthService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            secure: false,
            port: 587,
            tls: {
                rejectUnauthorized: true
            }
        });
    }

    async sendVerificationEmail(email) {
        try {
            const user = await User.findOne({ email });

            validateUser(user);

            validateSendEmailVerifyToken(user.isActive , user.verificationTokenExpiresAt);


            const verifyCode = generateCode();
            const hashedCode = hashCode(verifyCode);

            
            await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your email",
            text: `Your verification code is: ${verifyCode}`,
            });

            

            user.verificationToken = hashedCode;
            user.verificationTokenExpiresAt = (NOW().getTime()) + (1000 * 60 * 5); // 5 dk
            const val = user.verificationTokenExpiresAt;
            await user.save();

            
            const message = {
                message: successMessages.AUTH_SUCCESS.VERIFICATION_EMAIL_SENT,
                expiresAt: FORMAT_EXPIRES_AT(val)
            }

            return message;
        } catch (error) {
            throw error;
        }
    }

    async verifyEmail(email , code) {
        try {
            const user = await User.findOne({ email });
            validateUser(user);

            if (user.verificationTokenExpiresAt < NOW()) {
                user.verificationToken = null;
                user.verificationTokenExpiresAt = null;
                await user.save();
                throw new ForbiddenError(errorMessages.TOKEN.TOKEN_EXPIRED);
            }

            const isVerified = verifyHashedCode(code, user.verificationToken);

            if (!isVerified) {
                throw new ValidationError(errorMessages.TOKEN.TOKEN_INVALID);
            }

            user.isActive = 'active';
            user.verificationToken = null;
            user.verificationTokenExpiresAt = null;
            await user.save();

            const message = {
                message: successMessages.AUTH_SUCCESS.EMAIL_VERIFIED,
                user: _formatUserResponse(user)
            }

            return message;
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        try {
            console.log('Register service called with data:', {
                name: userData.name,
                surname: userData.surname,
                email: userData.email,
                phone: userData.phone,
                password2: userData.password,
                password: userData.password ? 'provided' : 'missing'
            });
            
            await validateRegister(userData);

            const existingUser = await User.findOne({ email: userData.email });
            const existingPhone = await User.findOne({ phone: userData.phone });
            if (existingUser || existingPhone) {
                throw new ConflictError(errorMessages.CONFLICT.USER_ALREADY_EXISTS);
            }
            
            const user = await this.createUser({ 
                name: userData.name, 
                surname: userData.surname, 
                email: userData.email, 
                phone: userData.phone, 
                password: userData.password
            });

            console.log('User created successfully:', user._id);
            
            await createLog(user._id, 'User', 'REGISTER');
            
            return {
                message: successMessages.AUTH_SUCCESS.USER_CREATED,
                user: _formatUserResponse(user)
            };
        } catch (error) {
            throw error;
        }
    }

    async createUser(userData) {
        try {
            console.log('Creating user with data:', {
                name: userData.name,
                surname: userData.surname,
                email: userData.email,
                phone: userData.phone,
                password: userData.password ? 'provided' : 'missing'
            });
            
            const { name, surname, email, phone, password } = userData;
            const hashedPassword = await hashPassword(password);
            
            console.log('Password hashed successfully');
            
            const user = new User({ 
                name, 
                surname, 
                email, 
                phone, 
                password: hashedPassword 
            });

            console.log('User model created, saving to database...');
            await user.save();
            console.log('User saved to database successfully');
            
            return user;
        } catch (error) {
            throw error;
        }
    }

    async checkPhone(phone) {
        try {
            const user = await User.findOne({ phone });
            if (user) {
                throw new ConflictError(errorMessages.CONFLICT.USER_ALREADY_EXISTS);
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
            const user = await User.findOne({ email });
            if (user) {
                throw new ConflictError(errorMessages.CONFLICT.USER_ALREADY_EXISTS);
            }
            return {
                message: successMessages.AUTH_SUCCESS.EMAIL_CHECKED,
                isExist: false
            };
        } catch (error) {
            throw error;
        }
    }

    async loginWithEmailSendCode(email) {
        try {
            const user = await User.findOne({ email });
            validateUser(user);
            validateLoginToken(user.isLoggedIn, user.loginTokenExpiresAt);

            const verifyCode = generateCode();
            const hashedCode = hashCode(verifyCode);

            
            await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Login Code",
            text: `Your login code is: ${verifyCode}`,
            });

            

            user.loginToken = hashedCode;
            user.loginTokenExpiresAt = (NOW().getTime()) + (1000 * 60 * 5); // 5 dk
            const val = user.loginTokenExpiresAt;
            await user.save();

            
            const message = {
                message: successMessages.AUTH_SUCCESS.LOGIN_CODE_SENT,
                expiresAt: FORMAT_EXPIRES_AT(val)
            }

            return message;

        } catch (error) {
            throw error;
        }
    }

    async loginWithEmailVerifyCode(email, code) {
        try {
            const user = await User.findOne({ email });
            validateUser(user);

            if (user.loginTokenExpiresAt < NOW()) {
                user.loginToken = null;
                user.loginTokenExpiresAt = null;
                await user.save();
                throw new ForbiddenError(errorMessages.TOKEN.TOKEN_EXPIRED);
            }

            const isVerified = verifyHashedCode(code, user.loginToken);
            if (!isVerified) {
                throw new ValidationError(errorMessages.INVALID.INVALID_LOGIN_CODE);
            }
            
            user.isLoggedIn = true;
            user.lastLoginAt = NOW();
            user.loginToken = null;
            user.loginTokenExpiresAt = null;
            await user.save();

            return {
                message: successMessages.AUTH_SUCCESS.LOGIN_SUCCESS,
                user: _formatUserResponse(user)
            };

        } catch (error) {
            throw error;
        }
    }

    async loginWithEmailPassword(email, password) {
        try {
            const user = await User.findOne({ email });
            validateUser(user);

            if (user.isLoggedIn) {
                throw new ForbiddenError(errorMessages.FORBIDDEN.USER_ALREADY_LOGGED_IN);
            }

            const isPasswordValid = await verifyPassword(password, user.password);
            if (!isPasswordValid) {
                throw new ValidationError(errorMessages.INVALID.PASSWORD_WRONG);
            }
            
            user.isLoggedIn = true;
            user.lastLoginAt = NOW();
            user.loginToken = null;
            user.loginTokenExpiresAt = null;
            await user.save();

            return {
                message: successMessages.AUTH_SUCCESS.LOGIN_SUCCESS,
                user: _formatUserResponse(user)
            };

            
        } catch (error) {
            throw error;
        }
    }

    async loginWithPhonePassword(phone, password) {
        try {
            const user = await User.findOne({ phone });
            validateUser(user);

            if (user.isLoggedIn) {  
                throw new ForbiddenError(errorMessages.FORBIDDEN.USER_ALREADY_LOGGED_IN);
            }

            const isPasswordValid = await verifyPassword(password, user.password);
            if (!isPasswordValid) {
                throw new ValidationError(errorMessages.INVALID.PASSWORD_WRONG);
            }
            
            user.isLoggedIn = true;
            user.lastLoginAt = NOW();
            user.loginToken = null;
            user.loginTokenExpiresAt = null;
            await user.save();

            return {
                message: successMessages.AUTH_SUCCESS.LOGIN_SUCCESS,
                user: _formatUserResponse(user)
            };

            
        } catch (error) {
            throw error;
        }
    }

    async logout(userId) {
        try {
            const user = await User.findById(userId);
            validateUser(user);

            user.isLoggedIn = false;
            user.loginToken = null;
            user.loginTokenExpiresAt = null;
            await user.save();

            return {
                message: successMessages.AUTH_SUCCESS.LOGOUT_SUCCESS
            };
        } catch (error) {
            throw error;
        }
    }

    async updateUser(requestBody) {
        try {
            // Validate user exists
            const user = await User.findById(requestBody.userId);
            validateUser(user);
            
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
                    const hashedPassword = await hashPassword(requestBody.password);
                    if (user.password !== hashedPassword) {
                        user.password = hashedPassword;
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
                    if (user.name !== requestBody.name) {
                        user.name = requestBody.name;
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
                    if (user.surname !== requestBody.surname) {
                        user.surname = requestBody.surname;
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
                await user.save();
                const updatedUser = await User.findById(requestBody.userId);
                return {
                    message: messageText.trim(),
                    user: _formatUserResponse(updatedUser),
                    success: true
                };
            } else {
                // This should not happen with the above checks, but keeping as a fallback
                return {
                    message: errorMessages.INVALID.NO_UPDATE,
                    user: _formatUserResponse(user),
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
                console.error('Error in updateUser:', error);
                throw new Error(errorMessages.INTERNAL.SERVER_ERROR);
            }
        }
    }

    async updateUserUniqueRequest(userId, data, type) {
        try {
            const user = await User.findById(userId);
            console.log(userId);
            console.log(data);
            console.log(type);
            validateUser(user);

            if (type === 'email') {
                validateEmail(data);

                const existingUser = await User.findOne({ email: data });
                if (existingUser && existingUser._id.toString() !== userId) {
                    throw new ConflictError(errorMessages.CONFLICT.USER_ALREADY_EXISTS);
                }
            }
            if (type === 'phone') {
                validatePhone(data);

                const existingUser = await User.findOne({ phone: data });
                if (existingUser && existingUser._id.toString() !== userId) {
                    throw new ConflictError(errorMessages.CONFLICT.USER_ALREADY_EXISTS);
                }
            }
    
            // Doğrulama kodu oluştur ve gönder
            const verifyCode = generateCode();
            const hashedCode = hashCode(verifyCode);
    
            // Email gönder
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Değişikliği Doğrulama",
                text: `Değişikliği doğrulama kodunuz: ${verifyCode}`,
            });
    
            // Redis'e geçici olarak yeni veriyi ve doğrulama kodunu sakla
            const redisClient = getRedisClient();
            const redisKey = `user:${userId}:update:${type}`;
            const updateData = {
                value: data,
                code: hashedCode,
                userId: userId
            };
            
            // 5 dakika (300 saniye) sonra otomatik silinecek şekilde Redis'e kaydet
            await redisClient.setEx(redisKey, 300, JSON.stringify(updateData));
            
            // Kullanıcıya güncelleme isteği yapıldığını bildir
            return {
                message: successMessages.AUTH_SUCCESS.VERIFICATION_EMAIL_SENT,
                expiresAt: FORMAT_EXPIRES_AT(NOW().getTime() + (1000 * 60 * 5)) // 5 dakika
            };
    
        } catch (error) {
            throw error;
        }
    }

    async verifyUpdateRequest(userId, code, type) {
        try {
            const user = await User.findById(userId);
            validateUser(user);


            const redisClient = getRedisClient();
            const redisKey = `user:${userId}:update:${type}`;
            // Redis'ten güncelleme verilerini al
            const updateDataStr = await redisClient.get(redisKey);
            
            if (!updateDataStr) {
                throw new ValidationError(errorMessages.INVALID.VERIFICATION_TOKEN_EXPIRED);
            }
            
            const updateData = JSON.parse(updateDataStr);
            
            // Doğrulama kodunu kontrol et
            const isCodeValid = verifyHashedCode(code, updateData.code);
            
            if (!isCodeValid) {
                throw new ValidationError(errorMessages.INVALID.VERIFICATION_CODE);
            }
            
            // Kullanıcı bilgilerini güncelle
            if (type === 'email') {
                user.email = updateData.value;
            } else if (type === 'phone') {
                user.phone = updateData.value;
            }
            
            await user.save();
            
            // Redis'ten geçici veriyi sil
            await redisClient.del(redisKey);
            
            return {
                message: successMessages.AUTH_SUCCESS.USER_UPDATED,
                user: _formatUserResponse(user)
            };
            
        } catch (error) {
            throw error;
        }
    }

    async cancelUpdateRequest(userId, type) {
        try {
            const user = await User.findById(userId);
            validateUser(user);
            
            const redisClient = getRedisClient();
            const redisKey = `user:${userId}:update:${type}`;
            // Redis'ten güncelleme verilerini al
            const updateDataStr = await redisClient.get(redisKey);
            
            if (!updateDataStr) {
                throw new ValidationError(errorMessages.INVALID.VERIFICATION_TOKEN_EXPIRED);
            }

            await redisClient.del(redisKey);

            return {
                message: successMessages.AUTH_SUCCESS.UPDATE_REQUEST_CANCELLED
            };
        } catch (error) {
            throw error;
        }
    }
    

    async getUser(userId) {
        try {
            const user = await User.findById(userId);
            validateUser(user);
            const message = {
                message: successMessages.AUTH_SUCCESS.USER_FOUND,
                user: _formatUserResponse(user)
            }
            return message;
        } catch (error) {
            throw error;
        }
    }



}


module.exports = new AuthService();
