module.exports = {
    INVALID: {
        INVALID_NAME: 'İsim geçersiz, en az 3 karakter, en fazla 50 karakter olmalıdır.',
        INVALID_STORE_ID: 'Mağaza ID geçersiz, en fazla 4 karakter, rakamlardan oluşmalıdır.',
        INVALID_LOCATION: 'Konum geçersiz, en az 3 karakter, en fazla 50 karakter olmalıdır.',
    },
    NOT_FOUND: {
        ADMIN_NOT_FOUND: 'Admin bulunamadı',
    },
    FORBIDDEN: {
        INSUFFICIENT_PERMISSIONS: 'Yetersiz yetki',
    },
    CONFLICT: {
        STOREID_ALREADY_EXISTS: 'Bu mağaza ID\'siyle bir mağaza zaten mevcut',
    },
    TOKEN: {
        TOKEN_EXPIRED: 'Token süresi doldu',
        TOKEN_NOT_FOUND: 'Token bulunamadı',
        TOKEN_INVALID: 'Token geçersiz',
        TOKEN_CANT_SEND_TIME: 'Yeni doğrulama kodu göndermek için en az 1 dakika geçmelidir.',
    },
    INTERNAL: {
        INTERNAL_SERVER_ERROR: 'İç sunucu hatası',
    },

    
};
