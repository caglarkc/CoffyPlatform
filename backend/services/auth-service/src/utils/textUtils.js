const errorMessages = require('../config/errorMessages');
const ValidationError = require('../utils/errors/ValidationError');

const validateName = (name) => {
    if (!name || name.length < 3 || name.length > 50 || !/^[a-zA-ZğüşıöçĞÜŞİÖÇ]+( [a-zA-ZğüşıöçĞÜŞİÖÇ]+)?$/.test(name)) {
        throw new ValidationError(errorMessages.INVALID.INVALID_NAME);
    }
};


const validateSurname = (surname) => {
    if (!surname || surname.length < 3 || surname.length > 50 || !/^[a-zA-ZğüşıöçĞÜŞİÖÇ]+( [a-zA-ZğüşıöçĞÜŞİÖÇ]+)?$/.test(surname)) {
        throw new ValidationError(errorMessages.INVALID.INVALID_SURNAME);
    }
};


const validateEmail = (email) => {
    if (!email || !email.includes('@')) {
        throw new ValidationError(errorMessages.INVALID.INVALID_EMAIL);
    }
};

const validatePhone = (phone) => {
    if (!phone || phone.length !== 10 || !/^[0-9]+$/.test(phone)) {
        throw new ValidationError(errorMessages.INVALID.INVALID_PHONE_NUMBER);
    }
};

const validatePassword = (password) => {
    if (!password || password.length < 8 || password.length > 20 || 
        !/[a-zğüşıöç]/.test(password) || 
        !/[A-ZĞÜŞİÖÇ]/.test(password) || 
        !/[0-9]/.test(password)){
        throw new ValidationError(errorMessages.INVALID.INVALID_PASSWORD);
    }
};

const validateRole = (role) => {
    console.log("role:", role);
    if (!role ||  role !== "RegionAdmin" || role !== "CityAdmin" || role !== "DistrictAdmin" || role !== "StoreAdmin" || role !== "StoreWorker") {
        throw new ValidationError(errorMessages.INVALID.INVALID_ROLE);
    }
}

module.exports = {
    validateName,
    validateSurname,
    validateEmail,
    validatePhone,
    validatePassword,
    validateRole
};