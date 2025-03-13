const axios = require('axios');
const Admin = require('../models/admin.model');
const {hashAdminData, verifyAdminData, verifyCreaterData} = require('../utils/helpers');
const {validateAdminRegister} = require('../utils/validationUtils');

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
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        city: admin.city,
        region: admin.region,
        district: admin.district,
        storeId: admin.storeId
    };
};

class AdminService {
    
    async createAdmin(data) {
        try {
            const {creatorEmail, creatorPassword,  name, surname, phone, email, password, role, city, region, district, storeId} = data;
            
            validateAdminRegister(data);
    
            const existingEmail = await Admin.findOne({email: email});
            const existingPhone = await Admin.findOne({phone: phone});
    
            if (existingEmail) {
                throw new ConflictError(errorMessages.CONFLICT.EMAIL_ALREADY_EXISTS);
            }
    
            if (existingPhone) {
                throw new ConflictError(errorMessages.CONFLICT.PHONE_ALREADY_EXISTS);
            }

            let isAllAccess = false;

            const creator = await Admin.findOne({role: "Creator"});

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
                if (level <= ROLE_CODES[role]) {
                    throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
                }
            }

            
            const hashedPassword = hashAdminData(password);
            
            const admin = this.createAdmin({
                name,
                surname,
                email,
                phone,
                password: hashedPassword,
                role,
                city,
                region,
                district,
                storeId
            });

            const message = "Admin başarıyla oluşturuldu";
            return {message: message, 
                    admin: _formatAdminResponse(admin)};
        } catch (error) {
            throw error;
        }

    }

    async createAdmin(adminData) {
        try {
            
            const { name, surname, email, phone, password, role, city, region, district, storeId } = adminData;
            const hashedPassword = hashAdminData(password);
            
            console.log('Password hashed successfully');
            
            const admin = new Admin({ 
                name, 
                surname, 
                email, 
                phone, 
                password: hashedPassword,
                role,
                city,
                region,
                district,
                storeId
            });

            console.log('Admin model created, saving to database...');
            await admin.save();
            console.log('Admin saved to database successfully');
            
            return admin;
        } catch (error) {
            throw error;
        }
    }

    async upgradeRole(creatorEmail, creatorPassword, email, newRole) {
        try {
            const admin = await Admin.findOne({email: email});
            if (!admin) {
                throw new NotFoundError(errorMessages.NOT_FOUND.USER_NOT_FOUND);
            }

            if (admin.role.code >= ROLE_CODES[newRole]) {
                throw new ForbiddenError(errorMessages.CONFLICT.ROLE_IS_SAME_OR_BETTER);
            }
            
            let isAllAccess = false;

            const creator = await Admin.findOne({role: "Creator"});

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
                if (level <= ROLE_CODES[newRole]) {
                    throw new ForbiddenError(errorMessages.FORBIDDEN.INSUFFICIENT_PERMISSIONS);
                }
            }

            admin.role = newRole;
            await admin.save();

            const message = "Rol başarıyla güncellendi";
            return {message: message, 
                    admin: _formatAdminResponse(admin)};


            
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = new AdminService();