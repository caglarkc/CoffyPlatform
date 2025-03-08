const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

// Hash'leme işlemi
const generateCode = () => {
    const randomString = Math.floor(100000 + Math.random() * 900000); // 6 haneli rastgele sayı
    return randomString;
};

const hashCode = (code) => {
    const secret = process.env.SECRET_KEY;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(code.toString()); // Veriyi hashle
    const hashedCode = hmac.digest('hex'); // Hash'i hex formatında döndür
    return hashedCode;
};

const verifyHashedCode = (code, hashedCode) => {
    const secret = process.env.SECRET_KEY;

    // HMAC ile kodu hashleyin
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(code.toString()); // Veriyi hashle
    const hashedInputCode = hmac.digest('hex'); // Hash'i hex formatında döndür

    // Kullanıcıdan alınan hash ile orijinal hash'i karşılaştırın
    return hashedInputCode === hashedCode;
};

const hashPassword = async (password) => {
    const secret = process.env.SECRET_KEY;
    if (!secret) {
        throw new Error('SECRET_KEY is not defined in environment variables');
    }
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(password);
    const hashedPassword = hmac.digest('hex');
    return hashedPassword;
};

const verifyPassword = async (password, hashedPassword) => {
    return hashPassword(password) === hashedPassword;
};


module.exports = {
    generateCode,
    hashCode,
    verifyHashedCode,
    hashPassword,
    verifyPassword
};
