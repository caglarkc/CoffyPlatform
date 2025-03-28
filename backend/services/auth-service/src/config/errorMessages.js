module.exports = {
    INVALID: {
        INVALID_CREDENTIALS: 'Geçersiz giriş bilgileri',
        INVALID_PHONE_NUMBER: 'Geçersiz telefon numarası, telefon numarası 10 karakter olmalıdır. (Başına 0 koymayınız!)',
        INVALID_EMAIL: 'Geçersiz email',
        INVALID_PASSWORD: 'Geçersiz şifre, şifre en az 8 karakter, en fazla 20 karakter ve en az birer büyük harf, küçük harf ve rakam içermelidir.',
        INVALID_NAME: 'Geçersiz isim, isim en az 3, en fazla 50 karakter ve sadece harflerden oluşmalıdır.',
        INVALID_SURNAME: 'Geçersiz soyisim, soyisim en az 3, en fazla 50 karakter ve sadece harflerden oluşmalıdır.',
        INVALID_LOGIN_CODE: 'Geçersiz giriş kodu',
        PASSWORD_WRONG: 'Şifre yanlış',
        NO_UPDATE: 'Bilgiler güncellenemedi',
        ALL_VALUES_SAME: 'Güncelleme yapılmadı, tüm değerler aynıdır.',
        VERIFICATION_TOKEN_EXPIRED: 'Doğrulama kodu süresi doldu',
        VERIFICATION_CODE: 'Geçersiz doğrulama kodu',
        NO_INFORMATION_PROVIDED: 'Bilgiler sağlanmadı',
        NO_PENDING_REQUEST: 'Bekleyen güncelleme isteği bulunamadı',
        REFRESH_TOKEN_REQUIRED: 'Refresh token gereklidir',
        INVALID_REFRESH_TOKEN: 'Geçersiz refresh token',
    },
    NOT_FOUND: {
        ADMIN_NOT_FOUND: 'Admin bulunamadı',
        USER_NOT_FOUND: 'Kullanıcı bulunamadı',
    },
    FORBIDDEN: {
        USER_ALREADY_ACTIVE: 'Kullanıcı maili doğrulanmış',
        USER_ALREADY_LOGGED_IN: 'Kullanıcı zaten giriş yapmış',
        USER_BLOCKED: 'Kullanıcı engellendi',
        USER_DELETED: 'Kullanıcı silindi',
        USER_NOT_VERIFIED: 'Kullanıcı maili doğrulanmamış',
        INSUFFICIENT_PERMISSIONS: 'Yetersiz yetki',
        BLOCKED_ADMIN: 'Admin engellendi',
        DELETED_ADMIN: 'Admin silindi',
        ALREADY_DELETED: 'Admin zaten silindi',
    },
    CONFLICT: {
        USER_ALREADY_EXISTS: 'Kullanıcı zaten mevcut',
        PHONE_ALREADY_EXISTS: 'Telefon numarası zaten mevcut',
        EMAIL_ALREADY_EXISTS: 'Email zaten mevcut',
        ADMIN_ALREADY_EXISTS: 'Admin zaten mevcut',
        ROLE_IS_SAME_OR_BETTER: 'Rol aynı veya daha yüksek bir rol mevcut',
        ROLE_IS_SAME_OR_LOWER: 'Rol aynı veya daha düşük bir rol mevcut',
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
