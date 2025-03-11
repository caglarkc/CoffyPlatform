# Coffy - Kahve Zinciri Mobil Uygulaması ve Backend Servisleri

Coffy, kahve zinciri için geliştirilmiş kapsamlı bir mobil uygulama ve backend servisleri projesidir. Kullanıcıların hesap oluşturabildiği, giriş yapabildiği, e-posta doğrulaması yapabildiği ve kahve siparişi verebildiği bir ekosistem sunar.

![Coffy Logo](path/to/logo.png)

## 📱 Proje Bileşenleri

Proje iki ana bileşenden oluşmaktadır:

### 1. Backend Servisleri
- **Mikroservis Mimarisi**: Her servis kendi veritabanı ve API'sine sahiptir
- **Auth Service**: Kullanıcı kaydı, girişi ve doğrulama işlemleri
- **User Service**: Kullanıcı profili ve tercihleri yönetimi
- **Order Service**: Sipariş oluşturma ve takip etme
- **Payment Service**: Ödeme işlemleri
- **Notification Service**: Bildirim gönderme

### 2. Mobil Uygulama
- **Android Native**: Java/Kotlin ile geliştirilmiş native Android uygulaması
- **Modern UI/UX**: Material Design prensipleri ile tasarlanmış kullanıcı arayüzü
- **Offline Modu**: İnternet bağlantısı olmadan da temel işlevleri kullanabilme
- **Konum Tabanlı Özellikler**: En yakın şubeleri bulma ve sipariş verme

## 🛠️ Teknoloji Yığını

### Backend
- **Dil**: Node.js, JavaScript/TypeScript
- **Framework**: Express.js
- **Veritabanı**: MongoDB
- **Kimlik Doğrulama**: JWT, OAuth2
- **API Dokümantasyonu**: Swagger
- **Test**: Jest, Supertest
- **CI/CD**: GitHub Actions
- **Deployment**: Docker, Kubernetes

### Mobil Uygulama
- **Dil**: Java/Kotlin
- **Mimari**: MVVM (Model-View-ViewModel)
- **Ağ İstekleri**: Retrofit, OkHttp
- **Asenkron İşlemler**: Coroutines (Kotlin) / AsyncTask (Java)
- **Resim Yükleme**: Glide/Picasso
- **Bağımlılık Enjeksiyonu**: Dagger Hilt
- **Yerel Veritabanı**: Room
- **Test**: JUnit, Espresso

## 🚀 Kurulum

### Backend Kurulumu

1. Gereksinimleri yükleyin:
   ```bash
   # Node.js ve npm'in yüklü olduğundan emin olun
   node -v
   npm -v
   
   # MongoDB'nin yüklü olduğundan emin olun
   mongod --version
   ```

2. Projeyi klonlayın ve bağımlılıkları yükleyin:
   ```bash
   git clone https://github.com/kullaniciadi/coffy.git
   cd coffy/backend
   npm install
   ```

3. Ortam değişkenlerini yapılandırın:
   ```bash
   cp .env.example .env
   # .env dosyasını düzenleyin ve gerekli değişkenleri ayarlayın
   ```

4. Servisleri başlatın:
   ```bash
   # Tüm servisleri başlatmak için
   npm run start:all
   
   # Veya belirli bir servisi başlatmak için
   cd services/auth-service
   npm start
   ```

### Mobil Uygulama Kurulumu

1. Android Studio'yu yükleyin (en son sürüm önerilir)

2. Projeyi klonlayın ve Android Studio'da açın:
   ```bash
   git clone https://github.com/kullaniciadi/coffy.git
   # Android Studio'yu açın ve "Open an existing Android Studio project" seçeneğini kullanarak
   # coffy/frontend/MobileApp dizinini seçin
   ```

3. Gradle senkronizasyonunu bekleyin

4. Uygulamayı çalıştırın:
   - Bir emülatör veya fiziksel cihaz seçin
   - "Run" düğmesine tıklayın

## 📊 Proje Yapısı

```
coffy/
├── backend/
│   ├── services/
│   │   ├── auth-service/
│   │   │   ├── src/
│   │   │   │   ├── config/
│   │   │   │   ├── controllers/
│   │   │   │   ├── middlewares/
│   │   │   │   ├── models/
│   │   │   │   ├── routes/
│   │   │   │   ├── services/
│   │   │   │   └── utils/
│   │   │   ├── tests/
│   │   │   ├── package.json
│   │   │   └── README.md
│   │   ├── user-service/
│   │   ├── order-service/
│   │   └── payment-service/
│   ├── gateway/
│   ├── docker-compose.yml
│   └── README.md
│
├── frontend/
│   ├── MobileApp/
│   │   ├── app/
│   │   │   ├── src/
│   │   │   │   ├── main/
│   │   │   │   │   ├── java/com/coffy/
│   │   │   │   │   │   ├── ui/
│   │   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── models/
│   │   │   │   │   │   └── utils/
│   │   │   │   │   └── res/
│   │   │   │   └── test/
│   │   │   └── build.gradle
│   │   ├── gradle/
│   │   └── README.md
│   └── WebAdmin/
│
├── docs/
│   ├── api/
│   ├── architecture/
│   └── guides/
│
├── .gitignore
├── LICENSE
└── README.md
```

## 🔄 API Endpoints

### Auth Service API

| Endpoint | Metod | Açıklama | Parametreler |
|----------|-------|----------|-------------|
| `/api/auth/register` | POST | Yeni kullanıcı kaydı | `name`, `surname`, `email`, `phone`, `password` |
| `/api/auth/login` | POST | Kullanıcı girişi | `email`, `password` |
| `/api/auth/verify-email` | POST | E-posta doğrulama | `email`, `code` |
| `/api/auth/send-verification-email` | POST | Doğrulama e-postası gönderme | `email` |

### User Service API

| Endpoint | Metod | Açıklama | Parametreler |
|----------|-------|----------|-------------|
| `/api/users/profile` | GET | Kullanıcı profili bilgilerini getir | - |
| `/api/users/profile` | PUT | Kullanıcı profili güncelle | `name`, `surname`, `phone` |
| `/api/users/preferences` | GET | Kullanıcı tercihlerini getir | - |
| `/api/users/preferences` | PUT | Kullanıcı tercihlerini güncelle | `preferences` |

### Order Service API

| Endpoint | Metod | Açıklama | Parametreler |
|----------|-------|----------|-------------|
| `/api/orders` | GET | Kullanıcının siparişlerini getir | - |
| `/api/orders` | POST | Yeni sipariş oluştur | `items`, `address`, `paymentMethod` |
| `/api/orders/:id` | GET | Sipariş detaylarını getir | - |
| `/api/orders/:id/cancel` | POST | Siparişi iptal et | - |

## 📝 Geliştirme Kılavuzu

### Backend Geliştirme

1. **Yeni Bir Servis Ekleme**:
   - `backend/services/` dizininde yeni bir klasör oluşturun
   - Temel dosyaları kopyalayın ve düzenleyin
   - `docker-compose.yml` dosyasına servisi ekleyin

2. **API Endpoint Ekleme**:
   - İlgili servisin `routes/` dizininde route tanımlayın
   - `controllers/` dizininde controller fonksiyonu oluşturun
   - Gerekirse `services/` dizininde servis fonksiyonları ekleyin

3. **Test Yazma**:
   - Her endpoint için en az bir test yazın
   - Edge case'leri test etmeyi unutmayın

### Mobil Geliştirme

1. **Yeni Bir Ekran Ekleme**:
   - `ui/` dizininde yeni bir aktivite veya fragment oluşturun
   - Layout XML dosyasını `res/layout/` dizininde oluşturun
   - `AndroidManifest.xml` dosyasına aktiviteyi ekleyin

2. **API Entegrasyonu**:
   - `services/` dizininde ilgili API servisini tanımlayın
   - Retrofit interface'ini güncelleyin
   - Gerekli model sınıflarını oluşturun

3. **UI Testleri**:
   - Espresso ile UI testleri yazın
   - Farklı ekran boyutları için test edin

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inize push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## 📞 İletişim

Proje Sahibi - alicaglarkocer@gmail.com

Proje Linki: [https://github.com/caglarkc/coffy](https://github.com/caglarkc/CoffyPlatform)
