# CoffyPlatform Frontend

<div align="center">
  <img src="https://raw.githubusercontent.com/caglarkc/CoffyPlatform/main/docs/assets/frontend-logo.png" alt="Frontend Logo" width="180" height="auto">
  <br/>
  <p><strong>Mobil Kahve Deneyimi için Modern Android Uygulaması</strong></p>
  <br/>
  
  ![Kotlin](https://img.shields.io/badge/Kotlin-1.8+-blue)
  ![Android](https://img.shields.io/badge/Android-SDK%2033+-brightgreen)
  ![MVVM](https://img.shields.io/badge/Architecture-MVVM-orange)
  ![Material](https://img.shields.io/badge/UI-Material%20Design%203-purple)
</div>

## 📑 İçindekiler

- [Genel Bakış](#-genel-bakış)
- [Mimari](#-mimari)
- [Ekranlar ve Özellikler](#-ekranlar-ve-özellikler)
- [Geliştirme Ortamı](#-geliştirme-ortamı)
- [Kurulum](#-kurulum)
- [Proje Yapısı](#-proje-yapısı)
- [Veri Yönetimi](#-veri-yönetimi)
- [Kullanıcı Arayüzü](#-kullanıcı-arayüzü)
- [Ağ İstekleri](#-ağ-istekleri)
- [Uygulama İçi Navigasyon](#-uygulama-içi-navigasyon)
- [Lokalizasyon](#-lokalizasyon)
- [Test](#-test)
- [Dağıtım](#-dağıtım)
- [Sık Sorulan Sorular](#-sık-sorulan-sorular)

## 🔍 Genel Bakış

CoffyPlatform Mobil Uygulaması, kahve tutkunlarına modern ve kullanıcı dostu bir arayüz sunan, müşterilerin kahve siparişi verebileceği, favori içeceklerini kaydedebileceği, en yakın şubeleri bulabileceği ve sadakat puanlarını takip edebileceği kapsamlı bir Android uygulamasıdır.

### Temel Özellikler

- **Kullanıcı Hesapları**: Kayıt olma, giriş yapma, profil yönetimi
- **Kahve Siparişi**: Ürün listesi, özelleştirme, sipariş oluşturma
- **Şube Bul**: Harita entegrasyonu, en yakın şubeleri görüntüleme
- **Sadakat Programı**: Puan kazanma, ödül kullanma, seviye yükseltme
- **Ödemeler**: Çeşitli ödeme yöntemleri (kredi kartı, mobil cüzdan)
- **Bildirimler**: Kampanya bildirimleri, sipariş durumu güncellemeleri
- **Çevrimdışı Mod**: İnternet bağlantısı olmadan temel işlevleri kullanabilme

## 🏗 Mimari

CoffyPlatform Mobil Uygulaması, MVVM (Model-View-ViewModel) mimari deseni üzerine kurulmuştur. Bu mimari, temiz kod, test edilebilirlik ve ölçeklenebilirlik sağlar.

<div align="center">
  <img src="https://raw.githubusercontent.com/caglarkc/CoffyPlatform/main/docs/assets/app-architecture.png" alt="Uygulama Mimarisi" width="700" height="auto">
</div>

### Mimari Bileşenler

- **View**: Activity, Fragment ve özel görünümler
- **ViewModel**: Görünüm mantığını ve veri işleme kodunu içerir
- **Repository**: Veri kaynaklarına erişimi soyutlar (API, yerel veritabanı)
- **DataSource**: API veya yerel veritabanından veri alır
- **Model**: Veri yapılarını ve iş mantığını temsil eder

## 📱 Ekranlar ve Özellikler

### Ana Ekranlar

| Ekran | Açıklama | Özellikler |
|-------|----------|------------|
| **Splash** | Açılış ekranı | Animasyon, otomatik giriş |
| **Giriş/Kayıt** | Kimlik doğrulama | Sosyal medya entegrasyonu, şifre kurtarma |
| **Ana Sayfa** | Karşılama ekranı | Popüler içecekler, kampanyalar, hızlı sipariş |
| **Menü** | Ürün listesi | Kategorilendirme, filtreleme, arama |
| **Ürün Detayı** | Ürün bilgileri | Özelleştirme, favorilere ekleme |
| **Sepet** | Sipariş özeti | Ürün ekleme/çıkarma, promosyon kodu |
| **Ödeme** | Ödeme işlemi | Çeşitli ödeme yöntemleri, adres seçimi |
| **Sipariş Takibi** | Sipariş durumu | Gerçek zamanlı güncelleme, harita entegrasyonu |
| **Profil** | Kullanıcı bilgileri | Bilgi düzenleme, sipariş geçmişi, favoriler |
| **Şubeler** | Şube listesi | Harita görünümü, şube detayları, yönlendirme |
| **Sadakat** | Puan ve ödüller | Puan geçmişi, ödül kullanımı, seviye bilgisi |
| **Ayarlar** | Uygulama ayarları | Bildirim tercihleri, dil seçimi, tema değiştirme |

### Yenilikçi Özellikler

- **QR Kod ile Sipariş**: Masadaki QR kodu okutarak hızlı sipariş verme
- **Kişiye Özel Öneriler**: Sipariş geçmişine göre özelleştirilmiş içecek önerileri
- **Arkadaşa Kahve Ismarla**: Arkadaşlar için uzaktan sipariş ve ödeme
- **Sipariş Paylaşma**: Siparişi sosyal medyada paylaşma
- **Kahve Hatırlatıcısı**: Kullanıcı alışkanlıklarına göre kahve hatırlatması
- **Çoklu Dil Desteği**: Türkçe ve İngilizce dil seçenekleri

## 💻 Geliştirme Ortamı

### Gereksinimler

- Android Studio Arctic Fox (2021.3.1) veya üzeri
- JDK 11 veya üzeri
- Kotlin 1.8 veya üzeri
- Android SDK 33 (minimum SDK 23)
- Gradle 8.0 veya üzeri

### Kullanılan Kütüphaneler

#### Temel Kütüphaneler
- **Kotlin Coroutines**: Asenkron işlemler için
- **Android Jetpack**: ViewModel, LiveData, Navigation Component, Room
- **Retrofit & OkHttp**: Ağ istekleri için
- **Moshi/Gson**: JSON serileştirme/deserileştirme
- **Glide/Coil**: Resim yükleme ve önbellekleme
- **Dagger Hilt**: Bağımlılık enjeksiyonu
- **Material Components**: UI tasarım bileşenleri

#### Test Kütüphaneleri
- **JUnit**: Birim testler
- **Mockito/MockK**: Nesneleri taklit etme
- **Espresso**: UI testleri
- **Robolectric**: Android framework'ünü taklit etme

## 🚀 Kurulum

### Geliştirme Ortamı Kurulumu

1. **Android Studio'yu Yükleyin**:
   - [Android Studio'yu indirin](https://developer.android.com/studio) ve yükleyin
   - JDK 11 veya üzerini kurduğunuzdan emin olun

2. **Projeyi Klonlayın**:
   ```bash
   git clone https://github.com/caglarkc/CoffyPlatform.git
   cd CoffyPlatform
   ```

3. **Android Studio'da Açın**:
   - Android Studio'yu başlatın
   - "Open an existing Android Studio project" seçin
   - `CoffyPlatform/frontend/Coffyapp` dizinini seçin

4. **Bağımlılıkları Senkronize Edin**:
   - Gradle senkronizasyonunu bekleyin
   - Gerekli SDK bileşenlerinin indirilmesini bekleyin

5. **Yerel Özellikleri Yapılandırın**:
   - `local.properties` dosyasını düzenleyin (gerekmiyorsa atlayabilirsiniz)
   ```properties
   sdk.dir=C\:\\Users\\USERNAME\\AppData\\Local\\Android\\Sdk
   MAPS_API_KEY=your_google_maps_api_key
   BASE_URL=https://api.coffyplatform.com
   ```

### Emülatör veya Gerçek Cihazda Çalıştırma

1. **Emülatör Oluşturun** (veya gerçek cihaz bağlayın):
   - "AVD Manager" açın
   - "Create Virtual Device" tıklayın
   - Bir cihaz seçin (örn. Pixel 6)
   - Bir sistem imajı seçin (örn. API 33)

2. **Uygulamayı Çalıştırın**:
   - Emülatörü veya gerçek cihazı seçin
   - Run düğmesine tıklayın (yeşil üçgen)

## 📂 Proje Yapısı

CoffyPlatform Mobil Uygulaması aşağıdaki klasör yapısını kullanır:

```
Coffyapp/
├── app/                  # Ana uygulama modülü
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/coffy/app/
│   │   │   │   ├── data/           # Veri katmanı
│   │   │   │   │   ├── api/        # API istekleri
│   │   │   │   │   ├── db/         # Yerel veritabanı
│   │   │   │   │   ├── model/      # Veri modelleri
│   │   │   │   │   └── repository/ # Repository sınıfları
│   │   │   │   │
│   │   │   │   ├── di/             # Dependency Injection
│   │   │   │   ├── ui/             # UI bileşenleri
│   │   │   │   │   ├── auth/       # Kimlik doğrulama ekranları
│   │   │   │   │   ├── cart/       # Sepet ekranları
│   │   │   │   │   ├── home/       # Ana sayfa ekranları
│   │   │   │   │   ├── menu/       # Menü ekranları
│   │   │   │   │   ├── order/      # Sipariş ekranları
│   │   │   │   │   ├── payment/    # Ödeme ekranları
│   │   │   │   │   ├── profile/    # Profil ekranları
│   │   │   │   │   └── common/     # Ortak UI bileşenleri
│   │   │   │   │
│   │   │   │   ├── util/           # Yardımcı sınıflar
│   │   │   │   └── CoffyApp.kt     # Uygulama sınıfı
│   │   │   │
│   │   │   ├── res/                # Kaynaklar
│   │   │   │   ├── drawable/       # Görseller
│   │   │   │   ├── layout/         # XML layout dosyaları
│   │   │   │   ├── values/         # Strings, colors, styles
│   │   │   │   ├── navigation/     # Navigation graph
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── AndroidManifest.xml
│   │   │
│   │   ├── test/                   # Birim testler
│   │   └── androidTest/            # UI testleri
│   │
│   ├── build.gradle                # Uygulama modülü yapılandırması
│   └── proguard-rules.pro          # ProGuard kuralları
│
├── gradle/                         # Gradle wrapper dosyaları
├── build.gradle                    # Proje yapılandırması
├── settings.gradle                 # Gradle ayarları
└── README.md                       # Bu dosya
```

## 📊 Veri Yönetimi

### Repository Pattern

CoffyPlatform Mobil Uygulaması, veri erişimi için Repository Pattern kullanır:

```kotlin
// Repository örneği
class MenuRepository @Inject constructor(
    private val menuApi: MenuApi,
    private val menuDao: MenuDao
) {
    suspend fun getMenuItems(categoryId: Int): Flow<Resource<List<MenuItem>>> = flow {
        emit(Resource.Loading())
        
        try {
            // Yerel veritabanından veri yükleme
            val localData = menuDao.getMenuItemsByCategory(categoryId)
            emit(Resource.Loading(data = localData))
            
            // API'den veri alma
            val remoteData = menuApi.getMenuItems(categoryId)
            
            // Yerel veritabanını güncelleme
            menuDao.deleteMenuItemsByCategory(categoryId)
            menuDao.insertMenuItems(remoteData)
            
            // Güncel verileri döndürme
            emit(Resource.Success(menuDao.getMenuItemsByCategory(categoryId)))
        } catch (e: Exception) {
            emit(Resource.Error(message = e.localizedMessage ?: "Bir hata oluştu"))
        }
    }
    
    // Diğer metodlar...
}
```

### Room Veritabanı

Çevrimdışı erişim için Room veritabanı kullanılır:

```kotlin
// Room Entity örneği
@Entity(tableName = "menu_items")
data class MenuItemEntity(
    @PrimaryKey val id: Int,
    val name: String,
    val description: String,
    val price: Double,
    val imageUrl: String,
    val categoryId: Int
)

// DAO örneği
@Dao
interface MenuDao {
    @Query("SELECT * FROM menu_items WHERE categoryId = :categoryId")
    suspend fun getMenuItemsByCategory(categoryId: Int): List<MenuItemEntity>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMenuItems(items: List<MenuItemEntity>)
    
    @Query("DELETE FROM menu_items WHERE categoryId = :categoryId")
    suspend fun deleteMenuItemsByCategory(categoryId: Int)
}
```

## 🎨 Kullanıcı Arayüzü

### Material Design

CoffyPlatform Mobil Uygulaması, Material Design 3 prensiplerini takip eder:

- **Tema**: Dynamic Colors, Light/Dark Mode
- **Bileşenler**: Material Components kullanımı
- **Tipografi**: Consistent typography scale
- **İkonlar**: Material Symbols

```xml
<!-- Theme örneği -->
<style name="Theme.CoffyPlatform" parent="Theme.Material3.DayNight.NoActionBar">
    <item name="colorPrimary">@color/md_theme_primary</item>
    <item name="colorOnPrimary">@color/md_theme_onPrimary</item>
    <item name="colorPrimaryContainer">@color/md_theme_primaryContainer</item>
    <item name="colorOnPrimaryContainer">@color/md_theme_onPrimaryContainer</item>
    <item name="colorSecondary">@color/md_theme_secondary</item>
    <!-- Diğer renkler... -->
</style>
```

### Özel Bileşenler

Tutarlı bir kullanıcı deneyimi için özel bileşenler:

```kotlin
// Özel buton bileşeni örneği
class CoffyButton @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : MaterialButton(context, attrs, defStyleAttr) {
    
    init {
        // Button özelliklerini ayarlama
        setTextAppearance(R.style.TextAppearance_Coffy_Button)
        backgroundTintList = ColorStateList.valueOf(context.getColor(R.color.primary))
        setTextColor(context.getColor(R.color.on_primary))
        cornerRadius = resources.getDimensionPixelSize(R.dimen.button_corner_radius)
        // Diğer özellikler...
    }
    
    // Ek metodlar...
}
```

## 🌐 Ağ İstekleri

### Retrofit & OkHttp

API istekleri için Retrofit ve OkHttp kullanılır:

```kotlin
// API servis tanımı
interface CoffyApi {
    @GET("menu")
    suspend fun getMenuItems(@Query("categoryId") categoryId: Int): List<MenuItemDto>
    
    @POST("orders")
    suspend fun createOrder(@Body order: OrderRequest): OrderResponse
    
    @GET("user/profile")
    suspend fun getUserProfile(): UserProfileResponse
    
    // Diğer API metodları...
}

// Retrofit konfigürasyonu
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor,
        loggingInterceptor: HttpLoggingInterceptor
    ): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build()
    }
    
    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideCoffyApi(retrofit: Retrofit): CoffyApi {
        return retrofit.create(CoffyApi::class.java)
    }
}
```

### Bağlantı Yönetimi

İnternet bağlantısı olmadığında uygulamanın davranışını yönetmek için:

```kotlin
// Bağlantı durumu gözlemleyicisi
class NetworkConnectivityObserver @Inject constructor(
    private val context: Context
) : ConnectivityObserver {
    
    private val connectivityManager = 
        context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    
    override fun observe(): Flow<ConnectivityObserver.Status> {
        return callbackFlow {
            val callback = object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: Network) {
                    super.onAvailable(network)
                    trySend(ConnectivityObserver.Status.Available)
                }
                
                override fun onLosing(network: Network, maxMsToLive: Int) {
                    super.onLosing(network, maxMsToLive)
                    trySend(ConnectivityObserver.Status.Losing)
                }
                
                override fun onLost(network: Network) {
                    super.onLost(network)
                    trySend(ConnectivityObserver.Status.Lost)
                }
                
                override fun onUnavailable() {
                    super.onUnavailable()
                    trySend(ConnectivityObserver.Status.Unavailable)
                }
            }
            
            connectivityManager.registerDefaultNetworkCallback(callback)
            
            awaitClose {
                connectivityManager.unregisterNetworkCallback(callback)
            }
        }.distinctUntilChanged()
    }
}
```

## 🧭 Uygulama İçi Navigasyon

### Navigation Component

Ekranlar arası geçişler için Navigation Component kullanılır:

```xml
<!-- Navigation grafiği örneği -->
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/nav_graph"
    app:startDestination="@id/splashFragment">

    <fragment
        android:id="@+id/splashFragment"
        android:name="com.coffy.app.ui.splash.SplashFragment"
        android:label="SplashFragment">
        <action
            android:id="@+id/action_splashFragment_to_loginFragment"
            app:destination="@id/loginFragment" />
        <action
            android:id="@+id/action_splashFragment_to_homeFragment"
            app:destination="@id/homeFragment" />
    </fragment>
    
    <fragment
        android:id="@+id/loginFragment"
        android:name="com.coffy.app.ui.auth.LoginFragment"
        android:label="LoginFragment">
        <action
            android:id="@+id/action_loginFragment_to_registerFragment"
            app:destination="@id/registerFragment" />
        <action
            android:id="@+id/action_loginFragment_to_homeFragment"
            app:destination="@id/homeFragment" />
    </fragment>
    
    <!-- Diğer fragment tanımları... -->
</navigation>
```

## 🌍 Lokalizasyon

### Çoklu Dil Desteği

CoffyPlatform Mobil Uygulaması, Türkçe ve İngilizce dillerini destekler:

```xml
<!-- values/strings.xml (İngilizce - Varsayılan) -->
<resources>
    <string name="app_name">Coffy</string>
    <string name="welcome_message">Welcome to Coffy!</string>
    <string name="login">Login</string>
    <string name="register">Register</string>
    <!-- Diğer metinler... -->
</resources>

<!-- values-tr/strings.xml (Türkçe) -->
<resources>
    <string name="app_name">Coffy</string>
    <string name="welcome_message">Coffy\'ye Hoş Geldiniz!</string>
    <string name="login">Giriş Yap</string>
    <string name="register">Kayıt Ol</string>
    <!-- Diğer metinler... -->
</resources>
```

## 🧪 Test

### Test Yapısı

CoffyPlatform Mobil Uygulaması, kapsamlı test yapısı sağlar:

#### Birim Testler

```kotlin
// ViewModel birim testi örneği
@RunWith(MockitoJUnitRunner::class)
class MenuViewModelTest {
    
    @get:Rule
    val instantTaskExecutorRule = InstantTaskExecutorRule()
    
    @Mock
    private lateinit var menuRepository: MenuRepository
    
    private lateinit var viewModel: MenuViewModel
    
    @Before
    fun setup() {
        viewModel = MenuViewModel(menuRepository)
    }
    
    @Test
    fun `when getMenuItems is called, should return success state with data`() = runTest {
        // Arrange
        val menuItems = listOf(
            MenuItem(1, "Americano", "Classic coffee", 25.0, "url", 1),
            MenuItem(2, "Latte", "Milk coffee", 30.0, "url", 1)
        )
        
        whenever(menuRepository.getMenuItems(1))
            .thenReturn(flowOf(Resource.Success(menuItems)))
        
        // Act
        viewModel.getMenuItems(1)
        
        // Assert
        val state = viewModel.menuItemsState.value
        assertTrue(state is Resource.Success)
        assertEquals(menuItems, (state as Resource.Success).data)
    }
    
    // Diğer testler...
}
```

#### UI Testler

```kotlin
// UI testi örneği
@RunWith(AndroidJUnit4::class)
@LargeTest
class MenuFragmentTest {
    
    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)
    
    @Before
    fun setup() {
        // Navigasyon ve veri hazırlama
        // ...
    }
    
    @Test
    fun displaysMenuItemsWhenFragmentIsLaunched() {
        // Menü öğelerinin görüntülendiğini doğrula
        onView(withId(R.id.menuRecyclerView))
            .check(matches(isDisplayed()))
        
        onView(withText("Americano"))
            .check(matches(isDisplayed()))
        
        onView(withText("Latte"))
            .check(matches(isDisplayed()))
    }
    
    @Test
    fun navigatesToDetailScreenWhenMenuItemIsClicked() {
        // Menü öğesine tıklama
        onView(withText("Americano"))
            .perform(click())
        
        // Detay ekranına geçildiğini doğrula
        onView(withId(R.id.productDetailContainer))
            .check(matches(isDisplayed()))
        
        onView(withId(R.id.productTitle))
            .check(matches(withText("Americano")))
    }
    
    // Diğer testler...
}
```

## 📦 Dağıtım

### Uygulama Paketleme

Üretim için uygulama paketleme:

```gradle
// Build konfigürasyonu
android {
    defaultConfig {
        applicationId "com.coffy.app"
        minSdkVersion 23
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
        
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    
    buildTypes {
        debug {
            applicationIdSuffix ".debug"
            debuggable true
            minifyEnabled false
        }
        
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            
            signingConfig signingConfigs.release
        }
    }
    
}
```

### Continuous Integration

GitHub Actions ile CI/CD:

```yaml
# .github/workflows/android.yml
name: Android CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 11
        uses: actions/setup-java@v3
        with:
          distribution: 'adopt'
          java-version: '11'
          
      - name: Grant execute permission for gradlew
        run: chmod +x ./gradlew
        
      - name: Build with Gradle
        run: ./gradlew build
        
      - name: Run Tests
        run: ./gradlew test
        
      - name: Build Debug APK
        run: ./gradlew assembleDebug
        
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-debug.apk
          path: app/build/outputs/apk/debug/app-debug.apk
```

## ❓ Sık Sorulan Sorular

<details>
<summary><b>Uygulamayı nasıl derlerim?</b></summary>
<p>
Uygulamayı derlemek için aşağıdaki adımları izleyin:

1. Android Studio'da projeyi açın
2. "Build" menüsünden "Make Project" seçin veya Ctrl+F9 tuşlarına basın
3. Debug APK oluşturmak için: "Build" menüsünden "Build Bundle(s) / APK(s)" > "Build APK(s)" seçin
4. Release APK oluşturmak için: "Build" menüsünden "Generate Signed Bundle / APK" seçin
</p>
</details>

<details>
<summary><b>Birden fazla dil nasıl eklerim?</b></summary>
<p>
Yeni bir dil eklemek için:

1. "res" klasöründe yeni bir "values-xx" klasörü oluşturun (xx: dil kodu, örn. fr için "values-fr")
2. Bu klasöre yeni bir "strings.xml" dosyası ekleyin
3. Orijinal "strings.xml" dosyasındaki tüm metinleri yeni dile çevirin
</p>
</details>

<details>
<summary><b>Uygulama mimarisi neden MVVM?</b></summary>
<p>
MVVM (Model-View-ViewModel) mimarisi, aşağıdaki avantajları sağladığı için tercih edilmiştir:

1. **Ayrışma**: UI ve iş mantığı ayrıştırılır
2. **Test Edilebilirlik**: ViewModel'ler kolayca test edilebilir
3. **Yaşam Döngüsü Yönetimi**: Configuration change durumlarında veri kaybını önler
4. **Reaktif UI Güncellemeleri**: LiveData/Flow ile UI otomatik güncellenir
5. **Tek Yönlü Veri Akışı**: Öngörülebilir uygulama durumu
</p>
</details>

---

Bu dokümantasyon, CoffyPlatform Mobil Uygulama Geliştirme Ekibi tarafından hazırlanmıştır. Sorularınız veya önerileriniz için lütfen GitHub issue açın. 