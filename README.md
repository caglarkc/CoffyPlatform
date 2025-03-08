# Coffy - Mobil Uygulama

Coffy, kullanıcıların hesap oluşturabildiği, giriş yapabildiği ve e-posta doğrulaması yapabildiği bir mobil uygulamadır. Bu proje, modern Android geliştirme pratiklerini kullanarak geliştirilmiştir.

## Özellikler

- Kullanıcı kaydı (ad, soyad, e-posta, telefon, şifre)
- Kullanıcı girişi
- E-posta doğrulama
- Form validasyonu
- Hata yönetimi
- API entegrasyonu

## Teknolojiler

- **Dil**: Kotlin/Java
- **Mimari**: MVVM (Model-View-ViewModel)
- **Ağ İstekleri**: Retrofit, OkHttp
- **Asenkron İşlemler**: Coroutines (Kotlin) / AsyncTask (Java)
- **UI Bileşenleri**: Material Design Components
- **Bağımlılık Enjeksiyonu**: Dagger Hilt (opsiyonel)

## Kurulum

1. Bu projeyi klonlayın:
   ```
   git clone https://github.com/kullaniciadi/coffy.git
   ```

2. Android Studio'da açın:
   - Android Studio'yu başlatın
   - "Open an existing Android Studio project" seçeneğini tıklayın
   - Klonladığınız dizini seçin

3. Gradle senkronizasyonunu bekleyin

4. Uygulamayı çalıştırın:
   - Bir emülatör veya fiziksel cihaz seçin
   - "Run" düğmesine tıklayın

## Backend Bağlantısı

Uygulama, varsayılan olarak `http://10.0.2.2:3001/api/auth/` adresindeki backend API'sine bağlanır. Bu, Android emülatörü içinden bilgisayarınızın localhost:3001 adresine erişmek için kullanılan özel bir IP adresidir.

- **Emülatör kullanıyorsanız**: `10.0.2.2` IP adresi kullanın
- **Fiziksel cihaz kullanıyorsanız**: Backend'in çalıştığı bilgisayarın yerel ağ IP adresini kullanın (örn. `192.168.1.5:3001`)

API URL'sini değiştirmek için `AuthService.kt` (veya `AuthService.java`) dosyasındaki `baseUrl` değerini güncelleyin.

## Proje Yapısı

```
app/
├── src/
│   ├── main/
│   │   ├── java/com/coffy/
│   │   │   ├── ui/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginActivity.kt
│   │   │   │   │   ├── RegisterActivity.kt
│   │   │   │   │   └── VerifyEmailActivity.kt
│   │   │   ├── services/
│   │   │   │   └── AuthService.kt
│   │   │   └── utils/
│   │   │       └── ValidationUtils.kt
│   │   └── res/
│   │       ├── layout/
│   │       │   ├── activity_login.xml
│   │       │   ├── activity_register.xml
│   │       │   └── activity_verify_email.xml
│   │       └── ...
│   └── ...
└── ...
```

## Backend Gereksinimleri

Bu mobil uygulama, aşağıdaki API endpoint'lerini sunan bir backend servisi gerektirir:

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/verify-email` - E-posta doğrulama
- `POST /api/auth/send-verification-email` - Doğrulama e-postası gönderme

Backend kodları için [backend repository](https://github.com/kullaniciadi/coffy-backend) adresini ziyaret edin.

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inize push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın


## İletişim

Proje Sahibi - [@caglar.kc_](https://instagram.com/caglar.kc_) - alicaglarkocer@gmail.com

Proje Linki: [https://github.com/caglarkc/coffy](https://github.com/caglarkc/coffy) 