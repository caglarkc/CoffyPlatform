# Coffy Mobile App

Bu mobil uygulama, Coffy projesinin kullanıcı kimlik doğrulama işlemlerini (kayıt, giriş ve e-posta doğrulama) gerçekleştirmek için geliştirilmiştir.

## Özellikler

- Kullanıcı kaydı
- E-posta doğrulama
- Kullanıcı girişi
- Kullanıcı bilgilerini görüntüleme

## Kurulum

1. Gerekli bağımlılıkları yükleyin:

```bash
npm install
```

2. Android için geliştirme yapmak için:

```bash
npx react-native run-android
```

3. iOS için geliştirme yapmak için:

```bash
npx react-native run-ios
```

## API Bağlantısı

Uygulama, varsayılan olarak `http://10.0.2.2:3000/api/auth` adresindeki backend API'sine bağlanır. Bu, Android emülatörü için localhost'a erişim sağlar. Gerçek bir cihazda test ederken veya farklı bir API adresi kullanmak istiyorsanız, `src/services/api.js` dosyasındaki `API_URL` değişkenini güncelleyin.

## Notlar

- Uygulamayı çalıştırmadan önce backend servisinin çalıştığından emin olun.
- Android emülatöründe test ederken, emülatörün localhost'a erişebilmesi için `10.0.2.2` IP adresini kullanın.
- iOS simülatöründe test ederken, `localhost` veya `127.0.0.1` IP adresini kullanabilirsiniz.

## Sorun Giderme

- Eğer "Metro bundler" başlatılamazsa, aşağıdaki komutu çalıştırın:

```bash
npx react-native start
```

- Daha sonra yeni bir terminal penceresinde uygulamayı başlatın:

```bash
npx react-native run-android
# veya
npx react-native run-ios
``` 