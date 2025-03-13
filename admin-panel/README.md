# Coffy Admin Panel

Bu proje, Coffy uygulamasının yönetici panelini içerir. React ve Material UI kullanılarak geliştirilmiştir ve backend Auth Service API'si ile entegre çalışır.

## Özellikler

- Kullanıcı kimlik doğrulama ve yetkilendirme
- Kullanıcı yönetimi (listeleme, ekleme, düzenleme, silme)
- Kullanıcı durumu yönetimi (aktif, pasif, engelli)
- Dashboard ile kullanıcı istatistikleri
- Responsive tasarım (mobil ve masaüstü uyumlu)

## Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- NPM (v6 veya üzeri)

### Adımlar

1. Projeyi klonlayın:
   ```
   git clone <repo-url>
   ```

2. Proje dizinine gidin:
   ```
   cd admin-panel
   ```

3. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

4. Geliştirme sunucusunu başlatın:
   ```
   npm start
   ```

5. Tarayıcıda [http://localhost:3000](http://localhost:3000) adresine gidin.

## Yapılandırma

Backend API URL'sini güncellemek için `src/services/api.js` dosyasını düzenleyin:

```js
const api = axios.create({
  baseURL: 'http://your-api-url/api',
  // ...
});
```

## Proje Yapısı

```
src/
  ├── assets/           # Resimler, ikonlar vb.
  ├── components/       # Yeniden kullanılabilir bileşenler
  │   ├── common/       # Ortak bileşenler
  │   └── layout/       # Düzen bileşenleri
  ├── context/          # React context'leri
  ├── pages/            # Sayfalar
  │   ├── Dashboard/    
  │   ├── Login/        
  │   └── UserManagement/
  ├── services/         # API servisleri
  ├── utils/            # Yardımcı fonksiyonlar
  ├── App.js            # Ana uygulama bileşeni
  └── index.js          # Giriş noktası
```

## API Entegrasyonu

Bu admin paneli, Coffy Auth Service ile entegre çalışmak üzere tasarlanmıştır. API entegrasyonu için `src/services/` dizinindeki servis dosyalarını kullanabilirsiniz.

## Notlar

- `src/services/auth.service.js` dosyasında kimlik doğrulama işlemleri yapılır.
- `src/services/user.service.js` dosyasında kullanıcı yönetimi işlemleri yapılır.

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
