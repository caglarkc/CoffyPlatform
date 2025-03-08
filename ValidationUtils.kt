// ValidationUtils.kt - Kotlin ile validasyon yardımcı sınıfı
package com.coffy.utils

import java.util.regex.Pattern

/**
 * Kullanıcı girdilerini doğrulamak için yardımcı sınıf
 */
object ValidationUtils {
    
    // Email regex pattern
    private val EMAIL_PATTERN = Pattern.compile(
        "[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}" +
        "\\@" +
        "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}" +
        "(" +
        "\\." +
        "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25}" +
        ")+"
    )
    
    // Telefon numarası regex pattern (Türkiye formatı)
    private val PHONE_PATTERN = Pattern.compile("^(05)[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]\$")
    
    /**
     * İsim validasyonu
     * @param name Doğrulanacak isim
     * @throws IllegalArgumentException Eğer isim geçersizse
     */
    @Throws(IllegalArgumentException::class)
    fun validateName(name: String) {
        if (name.isEmpty()) {
            throw IllegalArgumentException("İsim boş olamaz")
        }
        
        if (name.length < 2) {
            throw IllegalArgumentException("İsim en az 2 karakter olmalıdır")
        }
        
        if (name.length > 50) {
            throw IllegalArgumentException("İsim en fazla 50 karakter olmalıdır")
        }
        
        if (!name.matches(Regex("^[a-zA-ZğüşıöçĞÜŞİÖÇ ]+\$"))) {
            throw IllegalArgumentException("İsim sadece harflerden oluşmalıdır")
        }
    }
    
    /**
     * Soyisim validasyonu
     * @param surname Doğrulanacak soyisim
     * @throws IllegalArgumentException Eğer soyisim geçersizse
     */
    @Throws(IllegalArgumentException::class)
    fun validateSurname(surname: String) {
        if (surname.isEmpty()) {
            throw IllegalArgumentException("Soyisim boş olamaz")
        }
        
        if (surname.length < 2) {
            throw IllegalArgumentException("Soyisim en az 2 karakter olmalıdır")
        }
        
        if (surname.length > 50) {
            throw IllegalArgumentException("Soyisim en fazla 50 karakter olmalıdır")
        }
        
        if (!surname.matches(Regex("^[a-zA-ZğüşıöçĞÜŞİÖÇ ]+\$"))) {
            throw IllegalArgumentException("Soyisim sadece harflerden oluşmalıdır")
        }
    }
    
    /**
     * Email validasyonu
     * @param email Doğrulanacak email
     * @throws IllegalArgumentException Eğer email geçersizse
     */
    @Throws(IllegalArgumentException::class)
    fun validateEmail(email: String) {
        if (email.isEmpty()) {
            throw IllegalArgumentException("Email boş olamaz")
        }
        
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw IllegalArgumentException("Geçersiz email formatı")
        }
    }
    
    /**
     * Telefon numarası validasyonu
     * @param phone Doğrulanacak telefon numarası
     * @throws IllegalArgumentException Eğer telefon numarası geçersizse
     */
    @Throws(IllegalArgumentException::class)
    fun validatePhone(phone: String) {
        if (phone.isEmpty()) {
            throw IllegalArgumentException("Telefon numarası boş olamaz")
        }
        
        if (!PHONE_PATTERN.matcher(phone).matches()) {
            throw IllegalArgumentException("Geçersiz telefon numarası formatı. Örnek: 05xxxxxxxxx")
        }
    }
    
    /**
     * Şifre validasyonu
     * @param password Doğrulanacak şifre
     * @throws IllegalArgumentException Eğer şifre geçersizse
     */
    @Throws(IllegalArgumentException::class)
    fun validatePassword(password: String) {
        if (password.isEmpty()) {
            throw IllegalArgumentException("Şifre boş olamaz")
        }
        
        if (password.length < 8) {
            throw IllegalArgumentException("Şifre en az 8 karakter olmalıdır")
        }
        
        if (password.length > 20) {
            throw IllegalArgumentException("Şifre en fazla 20 karakter olmalıdır")
        }
        
        if (!password.matches(Regex(".*[A-Z].*"))) {
            throw IllegalArgumentException("Şifre en az bir büyük harf içermelidir")
        }
        
        if (!password.matches(Regex(".*[a-z].*"))) {
            throw IllegalArgumentException("Şifre en az bir küçük harf içermelidir")
        }
        
        if (!password.matches(Regex(".*\\d.*"))) {
            throw IllegalArgumentException("Şifre en az bir rakam içermelidir")
        }
        
        if (!password.matches(Regex(".*[!@#\$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*"))) {
            throw IllegalArgumentException("Şifre en az bir özel karakter içermelidir")
        }
    }
} 