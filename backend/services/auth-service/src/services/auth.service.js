    const User = require('../models/user.model');
    const nodemailer = require('nodemailer');
    const { generateCode , hashCode , verifyHashedCode , hashPassword , verifyPassword } = require('../utils/helpers');
    const { createLog } = require('./log.service');
    const { NOW } = require('../utils/constants/time');
    const { validateRegister , validateSendEmailVerifyToken , validateUser } = require('../utils/validationUtils');
    const errorMessages = require('../config/errorMessages');
    const ConflictError = require('../utils/errors/ConflictError');
    const ForbiddenError = require('../utils/errors/ForbiddenError');
    const ValidationError = require('../utils/errors/ValidationError');
    const successMessages = require('../config/successMessages');


    // Kullanıcı bilgilerini filtreleme yardımcı metodu
    const _formatUserResponse = (user) => {
        return {
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
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
                    expiresAt: val
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
                    user: _formatUserResponse(user),
                    message: successMessages.AUTH_SUCCESS.USER_CREATED
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
                    message: successMessages.AUTH_SUCCESS.PHONE_CHECKED
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
                    message: successMessages.AUTH_SUCCESS.EMAIL_CHECKED
                };
            } catch (error) {
                throw error;
            }
        }
    }


    module.exports = new AuthService();
