# CoffyPlatform - Modern Kahve Zinciri Yazılım Ekosistemi

<div align="center">
  <br/>
  <p><strong>Kahve deneyimini dijitalleştiren mikro servis mimarisi ile oluşturulmuş kompakt platform</strong></p>
  <br/>
  
  ![GitHub last commit](https://img.shields.io/github/last-commit/caglarkc/CoffyPlatform)
  ![GitHub issues](https://img.shields.io/github/issues/caglarkc/CoffyPlatform)
  ![GitHub pull requests](https://img.shields.io/github/issues-pr/caglarkc/CoffyPlatform)
  ![License](https://img.shields.io/badge/license-MIT-blue)
</div>

## 📑 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Sistem Mimarisi](#-sistem-mimarisi)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Kurulum Talimatları](#-kurulum-talimatları)
- [Geliştirme Ortamı](#-geliştirme-ortamı)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Proje Yapısı](#-proje-yapısı)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Sık Sorulan Sorular](#-sık-sorulan-sorular)
- [Lisans](#-lisans)
- [İletişim](#-iletişim)

## 🚀 Proje Hakkında

CoffyPlatform, modern kahve zincirlerinin ihtiyaç duyduğu tüm dijital altyapıyı sağlayan kapsamlı bir yazılım ekosistemidir. Müşterilerin mobil uygulama üzerinden sipariş verebilmesinden, ödeme işlemlerine, kampanya yönetiminden raporlamaya kadar tüm süreçleri entegre bir şekilde yönetir.

### Temel Özellikler

- **Güçlü Kullanıcı Yönetimi**: JWT tabanlı kimlik doğrulama, sosyal medya ile giriş, e-posta doğrulama
- **Zengin Sipariş Deneyimi**: QR kod ile sipariş, teslimat takibi, geçmiş sipariş görüntüleme
- **Esnek Ödeme Çözümleri**: Kredi kartı, mobil cüzdan, sadakat puanları ile ödeme
- **Kampanya Motoru**: Kullanıcıya özel kampanyalar, sadakat programı, hediye çekleri
- **Gelişmiş Analitik**: Satış analizleri, müşteri davranışları, envanter takibi
- **Gerçek Zamanlı Bildirimler**: Sipariş durumu bildirimleri, özel teklifler, hatırlatmalar

## 🏗 Sistem Mimarisi

CoffyPlatform, mikroservis mimarisi ile tasarlanmış olup her bir servis kendi sorumluluğunu bağımsız olarak yönetir:

<div align="center">
  <img src="https://raw.githubusercontent.com/caglarkc/CoffyPlatform/main/docs/assets/architecture-diagram.png" alt="Sistem Mimarisi" width="800" height="auto">
</div>

### Backend Mimarisi

- **API Gateway**: Tüm isteklerin yönlendirildiği merkezi giriş noktası
- **Service Registry**: Servislerin kayıt ve keşif mekanizması
- **Config Server**: Merkezi konfigürasyon yönetimi
- **Circuit Breaker**: Servis hatalarına karşı dayanıklılık sağlayan mekanizma
- **Mikroservisler**: Bağımsız geliştirilebilen, ölçeklenebilen servisler
  - Auth Service: Kimlik doğrulama ve yetkilendirme
  - Menu Service: Ürün ve menü yönetimi
  - Order Service: Sipariş işleme ve takibi
  - Payment Service: Ödeme işlemleri
  - Campaign Service: Promosyon ve kampanya yönetimi
  - Notification Service: Bildirim gönderimi
  - Report Service: Analitik ve raporlama

### Frontend Mimarisi

- **Android Mobil Uygulama**: Müşteriler için native mobil deneyim
- **Yönetim Paneli (Web)**: İşletme sahipleri için yönetim arayüzü (planlanan)

## 💻 Teknoloji Yığını

### Backend
- **Programlama Dili**: Node.js, TypeScript
- **API Framework**: Express.js
- **Kimlik Doğrulama**: JWT, OAuth 2.0
- **Veritabanı**: MongoDB (Mikroservisler için)
- **Mesajlaşma**: RabbitMQ (Servisler arası iletişim)
- **Docker & Kubernetes**: Konteynerizasyon ve orkestrasyon
- **CI/CD**: GitHub Actions
- **API Dokümantasyonu**: Swagger/OpenAPI
- **Test**: Jest, Supertest

### Frontend
- **Android**: Java, MVVM mimarisi
- **Ağ İstekleri**: Retrofit, OkHttp
- **Yerel Veritabanı**: Room
- **Görüntü Yükleme**: Glide
- **Dependency Injection**: Dagger Hilt
- **Asenkron İşlemler**: Coroutines
- **UI Bileşenleri**: Material Design Components
- **Test**: JUnit, Espresso

## 🔧 Kurulum Talimatları

### Ön Gereksinimler

- Node.js v16 veya üzeri
- MongoDB v4.4 veya üzeri
- Docker ve Docker Compose
- Android Studio (mobil uygulama geliştirmek için)

### Backend Kurulumu

Tüm mikroservisleri Docker ile çalıştırmak için:

```bash
# Ana dizine gidin
cd CoffyPlatform

# Docker container'ları başlatın
docker-compose up
```

Veya manuel olarak geliştirme ortamında çalıştırmak için:

```bash
# Backend ana dizinine gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# Tüm servisleri başlatın
npm run start:all

# Sadece belirli bir servisi başlatmak için
cd services/auth-service
npm install
npm start
```

### Frontend Kurulumu

```bash
# Android Studio'yu açın ve projeyi içe aktarın
cd frontend/Coffyapp

# Gradle senkronizasyonunu tamamlayın
# Emülatör veya fiziksel cihaz seçin
# Run butonuna tıklayın
```

Detaylı kurulum talimatları için [backend/README.md](backend/README.md) ve [frontend/README.md](frontend/README.md) dosyalarına bakabilirsiniz.

## 💡 Geliştirme Ortamı

### Önerilen IDE'ler
- **Backend**: Visual Studio Code
- **Frontend**: Android Studio

### Yararlı Eklentiler
- ESLint ve Prettier (Backend)
- Kotlin Plugin (Frontend)
- MongoDB Compass (Veritabanı Yönetimi)
- Postman (API Testi)

### Kod Standardı
Bu projede:
- Backend için [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Frontend için [Android Kotlin Style Guide](https://developer.android.com/kotlin/style-guide)
kuralları uygulanmaktadır.

## 📚 API Dokümantasyonu

Her mikroservis kendi API dokümantasyonunu Swagger UI üzerinden sağlar:

- Auth Service: `http://localhost:3001/api-docs`
- Menu Service: `http://localhost:3002/api-docs`
- Order Service: `http://localhost:3003/api-docs`
- Payment Service: `http://localhost:3004/api-docs`
- Campaign Service: `http://localhost:3005/api-docs`
- Notification Service: `http://localhost:3006/api-docs`
- Report Service: `http://localhost:3007/api-docs`

Ek olarak, tüm API'leri bir arada görmek için API Gateway'in Swagger UI'sini kullanabilirsiniz:
`http://localhost:3000/api-docs`

## 🔄 CI/CD Pipeline

Bu proje, GitHub Actions kullanılarak sürekli entegrasyon ve dağıtım süreçlerini otomatize eder:

- **Lint Kontrolü**: ESLint ile kod standardı kontrolü
- **Birim Testler**: Jest ile otomatik test çalıştırma
- **Entegrasyon Testleri**: Servislerin birlikte çalışmasını test etme
- **Docker İmaj Oluşturma**: CI sürecinde Docker imajları oluşturma
- **Otomatik Dağıtım**: Test ortamına otomatik dağıtım, production dağıtımı için manuel onay

## 📊 Proje Yapısı

```
CoffyPlatform/
├── backend/                      # Backend ana dizini
│   ├── config/                   # Ortak konfigürasyon dosyaları
│   ├── gateway/                  # API Gateway
│   ├── services/                 # Mikroservisler
│   │   ├── auth-service/         # Kimlik doğrulama servisi
│   │   ├── menu-service/         # Menü ve ürün servisi
│   │   ├── order-service/        # Sipariş işleme servisi
│   │   ├── payment-service/      # Ödeme işleme servisi
│   │   ├── campaign-service/     # Kampanya yönetim servisi
│   │   ├── notification-service/ # Bildirim servisi
│   │   └── report-service/       # Raporlama servisi
│   ├── shared/                   # Servisler arası paylaşılan kod ve utility'ler
│   ├── docker-compose.yml        # Docker yapılandırma dosyası
│   └── README.md                 # Backend dokümantasyonu
│
├── frontend/                     # Frontend ana dizini
│   └── Coffyapp/                 # Android uygulaması
│       ├── app/                  # Uygulama kodu
│       ├── gradle/               # Gradle yapılandırma
│       └── README.md             # Frontend dokümantasyonu
│
├── docs/                         # Teknik dokümantasyon ve görseller
│   ├── assets/                   # Görseller, diyagramlar
│   ├── api/                      # API belgeleri
│   └── architecture/             # Mimari belgeler
│
├── .github/                      # GitHub Actions workflow tanımları
├── .gitignore                    # Git tarafından yok sayılacak dosyalar
├── LICENSE                       # Lisans bilgisi
└── README.md                     # Bu dosya
```

Detaylı proje yapısı için [backend/README.md](backend/README.md) ve [frontend/README.md](frontend/README.md) dosyalarına bakabilirsiniz.

## 👥 Katkıda Bulunma

Bu projeye katkıda bulunmak istiyorsanız, lütfen şu adımları izleyin:

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inize push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

Detaylı katkıda bulunma kuralları için `CONTRIBUTING.md` dosyasına bakabilirsiniz.

## ❓ Sık Sorulan Sorular

<details>
<summary><b>Proje nasıl bir mimariye sahip?</b></summary>
<p>
CoffyPlatform, mikroservis mimarisi üzerine inşa edilmiştir. Her bir servis belirli bir iş fonksiyonunu yerine getirir ve bağımsız olarak geliştirilebilir, test edilebilir ve dağıtılabilir.
</p>
</details>

<details>
<summary><b>Backend servisleri nasıl iletişim kurar?</b></summary>
<p>
Servisler arası iletişim REST API ve RabbitMQ mesajlaşma sistemi üzerinden gerçekleştirilir. Senkron iletişim için REST API, asenkron işlemler için ise RabbitMQ kullanılır.
</p>
</details>

<details>
<summary><b>Mobil uygulama hangi platformları destekler?</b></summary>
<p>
Şu anda Android platformu için native bir uygulama bulunmaktadır. iOS desteği gelecek sürümlerde planlanmaktadır.
</p>
</details>

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 📞 İletişim

Çağlar Koçer - [alicaglarkocer@gmail.com](mailto:alicaglarkocer@gmail.com)

Proje Bağlantısı: [https://github.com/caglarkc/CoffyPlatform](https://github.com/caglarkc/CoffyPlatform)

---
⭐️ **CoffyPlatform** - Kahve severlere modern dijital deneyim sunarak işletmelerin büyümesine katkı sağlar.
