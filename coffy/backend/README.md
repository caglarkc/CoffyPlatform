# CoffyPlatform Backend

<div align="center">
  <img src="https://raw.githubusercontent.com/caglarkc/CoffyPlatform/main/docs/assets/backend-logo.png" alt="Backend Logo" width="180" height="auto">
  <br/>
  <p><strong>Mikroservis Mimarisi ile Ölçeklenebilir Backend Altyapısı</strong></p>
  <br/>
  
  ![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
  ![MongoDB](https://img.shields.io/badge/MongoDB-v4.4+-lightgreen)
  ![Express](https://img.shields.io/badge/Express-v4.18+-blue)
  ![Docker](https://img.shields.io/badge/Docker-Support-blue)
</div>

## 📑 İçindekiler

- [Genel Bakış](#-genel-bakış)
- [Mimari](#-mimari)
- [Mikroservisler](#-mikroservisler)
- [Geliştirme Ortamı](#-geliştirme-ortamı)
- [Kurulum](#-kurulum)
- [Konfigürasyon](#-konfigürasyon)
- [API Gateway](#-api-gateway)
- [Servisler Arası İletişim](#-servisler-arası-iletişim)
- [Veritabanı Yapısı](#-veritabanı-yapısı)
- [Loglama ve İzleme](#-loglama-ve-izleme)
- [Testler](#-testler)
- [Deployment](#-deployment)
- [Sık Sorulan Sorular](#-sık-sorulan-sorular)

## 🔍 Genel Bakış

CoffyPlatform Backend, kahve zinciri iş operasyonlarını yönetmek için tasarlanmış bir mikroservis mimarisidir. Her bir servis, belirli bir iş fonksiyonu üzerine odaklanmıştır ve bağımsız olarak geliştirilebilir, test edilebilir ve dağıtılabilir. Bu mimari, yüksek ölçeklenebilirlik, dayanıklılık ve bakım kolaylığı sağlar.

### Temel Teknolojiler

- **Node.js & Express**: API geliştirme
- **MongoDB**: Veri depolama
- **JWT**: Kimlik doğrulama
- **Docker & Kubernetes**: Konteynerizasyon ve orkestrasyon
- **API Gateway**: İstek yönlendirme ve yönetme
- **RabbitMQ**: Asenkron mesajlaşma
- **Redis**: Önbellekleme ve oturum yönetimi

## 🏗 Mimari

CoffyPlatform Backend, aşağıdaki mimari prensipleri takip eder:

<div align="center">
  <img src="https://raw.githubusercontent.com/caglarkc/CoffyPlatform/main/docs/assets/backend-architecture.png" alt="Backend Mimarisi" width="700" height="auto">
</div>

### Mimari Prensipler

1. **Domain-Driven Design (DDD)**: Her mikroservis, belirli bir iş alanına odaklanır
2. **API-First Yaklaşımı**: Tüm servisler, iyi tanımlanmış API'ler üzerinden iletişim kurar
3. **Immutable Infrastructure**: Container'lar değiştirilmez, güncellemeler yeni dağıtımlarla yapılır
4. **Fault Isolation**: Bir servisteki hata diğer servisleri etkilemez
5. **Decentralized Data Management**: Her servis kendi veritabanını yönetir
6. **Automated CI/CD**: Otomatik test ve dağıtım süreçleri

## 🧩 Mikroservisler

CoffyPlatform Backend aşağıdaki mikroservislerden oluşur:

| Servis | Port | Açıklama | Detay |
|--------|------|----------|-------|
| **API Gateway** | 3000 | İstek yönlendirme ve API birleştirme | [Dökümantasyon](backend/gateway/README.md) |
| **Auth Service** | 3001 | Kimlik doğrulama ve yetkilendirme | [Dökümantasyon](backend/services/auth-service/README.md) |
| **Menu Service** | 3002 | Ürün ve menü yönetimi | [Dökümantasyon](backend/services/menu-service/README.md) |
| **Order Service** | 3003 | Sipariş işleme ve takibi | [Dökümantasyon](backend/services/order-service/README.md) |
| **Payment Service** | 3004 | Ödeme işlemleri | [Dökümantasyon](backend/services/payment-service/README.md) |
| **Campaign Service** | 3005 | Kampanya ve promosyon yönetimi | [Dökümantasyon](backend/services/campaign-service/README.md) |
| **Notification Service** | 3006 | Bildirim ve e-posta yönetimi | [Dökümantasyon](backend/services/notification-service/README.md) |
| **Report Service** | 3007 | Raporlama ve analitik | [Dökümantasyon](backend/services/report-service/README.md) |

### Tipik Mikroservis Yapısı

Her mikroservis şu klasör yapısını takip eder:

```
service-name/
├── src/
│   ├── config/          # Konfigürasyon dosyaları
│   ├── controllers/     # HTTP isteklerini karşılayan kontrolcüler
│   ├── middlewares/     # Express.js middleware'leri
│   ├── models/          # Veri modelleri
│   ├── routes/          # API endpoint yönlendirmeleri
│   ├── services/        # İş mantığını içeren servis katmanı
│   ├── utils/           # Yardımcı fonksiyonlar ve araçlar
│   ├── validations/     # Girdi doğrulama şemaları
│   ├── app.js           # Express uygulaması
│   └── index.js         # Giriş noktası
├── tests/               # Test dosyaları
├── Dockerfile           # Docker yapılandırması
├── .env.example         # Örnek çevresel değişkenler
├── package.json         # Proje bağımlılıkları
└── README.md            # Servis dokümantasyonu
```

## 💻 Geliştirme Ortamı

### Gereksinimler

- Node.js v16 veya üzeri
- npm v7 veya üzeri
- MongoDB v4.4 veya üzeri
- Docker ve Docker Compose
- Postman (API testleri için)

### Önerilen IDE ve Eklentiler

- **Visual Studio Code**
  - ESLint
  - Prettier
  - Docker
  - MongoDB for VS Code
  - REST Client

### Stil Klavuzu

CoffyPlatform Backend, [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) takip eder. ESLint ve Prettier konfigürasyonları bu kurallara göre ayarlanmıştır.

## 🚀 Kurulum

### Yerel Geliştirme Ortamı

```bash
# Projeyi klonlayın
git clone https://github.com/caglarkc/CoffyPlatform.git
cd CoffyPlatform/backend

# Bağımlılıkları yükleyin
npm install

# Tüm .env.example dosyalarını kopyalayın
find . -name ".env.example" -exec sh -c 'cp "$1" "${1%.example}"' _ {} \;

# Servisleri başlatın
npm run start:all
```

### Docker ile Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/caglarkc/CoffyPlatform.git
cd CoffyPlatform/backend

# Docker container'larını başlatın
docker-compose up -d
```

## ⚙️ Konfigürasyon

Tüm servisler için ortak konfigürasyon ayarları `backend/config` dizininde bulunur. Her servis için özel konfigürasyon ise ilgili servisin `src/config` dizininde yer alır.

### Çevresel Değişkenler

Her servis kendi `.env` dosyasını kullanır. Örnek değişkenler:

```
# Genel Ayarlar
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug

# Veritabanı
MONGODB_URI=mongodb://localhost:27017/service-name

# JWT Ayarları
JWT_SECRET=your-jwt-secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Servis Bağlantıları
API_GATEWAY_URL=http://localhost:3000
AUTH_SERVICE_URL=http://localhost:3001
NOTIFICATION_SERVICE_URL=http://localhost:3006

# Mesajlaşma
RABBITMQ_URL=amqp://localhost:5672
```

## 🌐 API Gateway

API Gateway, tüm istemci isteklerinin girdiği merkezi noktadır. Aşağıdaki özellikleri sağlar:

- **İstek Yönlendirme**: İstekleri ilgili mikroservislere yönlendirir
- **API Birleştirme**: Farklı servislerden gelen yanıtları birleştirebilir
- **Kimlik Doğrulama**: JWT doğrulaması yapar
- **Rate Limiting**: İstek sayısını sınırlar
- **Loglama**: Tüm istekleri loglar
- **Önbellekleme**: Sık kullanılan verileri önbellekler

API Gateway yapılandırması `backend/gateway/src/config/gateway.js` dosyasında bulunur.

## 🔄 Servisler Arası İletişim

Mikroservisler arasında iki tür iletişim yöntemi kullanılır:

### 1. Senkron İletişim (HTTP/REST)

Servisler, REST API'ler aracılığıyla doğrudan birbirleriyle iletişim kurabilir. 

```javascript
// Örnek: Auth Service'den User Service'e HTTP isteği
const response = await axios.get(`${config.userServiceUrl}/api/users/${userId}`, {
  headers: { Authorization: `Bearer ${serviceToken}` }
});
```

### 2. Asenkron İletişim (Event-Driven)

Kritik olmayan veya asenkron işlemler için RabbitMQ kullanılır. Bu, servislerin birbirinden bağımsız olarak çalışabilmesini sağlar.

```javascript
// Örnek: Bir event yayınlama
await messageBroker.publish('user.registered', {
  userId: user.id,
  email: user.email,
  registeredAt: new Date()
});
```

```javascript
// Örnek: Bir eventi dinleme
messageBroker.subscribe('user.registered', async (data) => {
  await notificationService.sendWelcomeEmail(data.email);
});
```

## 📊 Veritabanı Yapısı

Her mikroservis kendi veritabanını yönetir. Bu, servislerin bağımsız olarak evrilebilmesini sağlar ve veritabanı şemalarının değişmesi durumunda diğer servislerin etkilenmemesini garanti eder.

### Veritabanı Bağlantısı

```javascript
// MongoDB bağlantı örneği
const mongoose = require('mongoose');
const logger = require('../utils/logger');

mongoose.connect(config.mongodb.uri, config.mongodb.options)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error:', err));
```

### Şema Örneği

```javascript
// User model örneği
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  /* Diğer alanlar */
}, { timestamps: true });

// Şifre hashleme
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Şifre doğrulama
userSchema.methods.isPasswordMatch = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
```

## 📝 Loglama ve İzleme

CoffyPlatform Backend, kapsamlı loglama ve izleme özellikleri sunar:

### Winston Logger

```javascript
// Logger yapılandırması
const winston = require('winston');

const logger = winston.createLogger({
  level: config.logLevel || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
```

### Prometheus Metrics

Servis performansını izlemek için Prometheus metrics endpoint'leri sağlanır:

```javascript
const promClient = require('prom-client');
const collectDefaultMetrics = promClient.collectDefaultMetrics;

// Default metrikler
collectDefaultMetrics({ timeout: 5000 });

// Özel metrikler
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});

// Metrik endpoint'i
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});
```

## 🧪 Testler

Backend servisleri için kapsamlı test yapısı sunulmaktadır:

### Birim Testler (Jest)

```javascript
// Kullanıcı servisi birim testi örneği
const UserService = require('../../src/services/user.service');
const User = require('../../src/models/user.model');

jest.mock('../../src/models/user.model');

describe('UserService', () => {
  test('should create a new user', async () => {
    // Arrange
    const userData = { email: 'test@example.com', password: 'password123' };
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce({ _id: 'user123', ...userData });
    
    // Act
    const userService = new UserService();
    const result = await userService.createUser(userData);
    
    // Assert
    expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    expect(User.create).toHaveBeenCalledWith(userData);
    expect(result).toHaveProperty('_id', 'user123');
  });
});
```

### Entegrasyon Testler (Supertest)

```javascript
// Auth controller entegrasyon testi örneği
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const mongoose = require('mongoose');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New',
        surname: 'User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('tokens');
  });
});
```

## 🚢 Deployment

CoffyPlatform Backend, Docker ve Kubernetes kullanılarak kolayca dağıtılabilir.

### Docker Deployment

```bash
# Tüm servisleri build edin
docker-compose build

# Servisleri başlatın
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Kubernetes yapılandırmalarını uygulayın
kubectl apply -f k8s/

# Pod durumlarını kontrol edin
kubectl get pods
```

## ❓ Sık Sorulan Sorular

<details>
<summary><b>Yeni bir mikroservis nasıl eklerim?</b></summary>
<p>
1. `backend/services/` dizininde yeni bir klasör oluşturun
2. Temel dosya yapısını ve gerekli bağımlılıkları ekleyin
3. Docker Compose dosyasına yeni servisi ekleyin
4. API Gateway konfigürasyonunu güncelleyin
</p>
</details>

<details>
<summary><b>Servisler arası iletişim nasıl sağlanır?</b></summary>
<p>
İki yöntem kullanılır:

1. **HTTP/REST**: Doğrudan servis çağrıları için
2. **Event-Based**: RabbitMQ üzerinden asenkron iletişim için

Her duruma göre uygun yöntemi seçin. Kritik ve anlık cevap gerektiren işlemler için HTTP, asenkron işlemler için event-based yaklaşım daha uygundur.
</p>
</details>

<details>
<summary><b>Bir serviste hata olursa diğer servisler etkilenir mi?</b></summary>
<p>
Hayır, mikroservis mimarisi sayesinde her servis izole edilmiştir. Circuit breaker pattern kullanılarak, bir servisin çökmesi durumunda diğer servislerin etkilenmemesi sağlanır.
</p>
</details>

---

Bu dokümantasyon, CoffyPlatform Backend geliştirme ekibi tarafından hazırlanmıştır. Sorularınız veya önerileriniz için lütfen GitHub issue açın. 