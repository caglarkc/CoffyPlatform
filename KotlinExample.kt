// AuthService.kt - Kotlin ile API servisi örneği
package com.coffy.services

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

// API istekleri için data class'lar
data class RegisterRequest(
    val name: String,
    val surname: String,
    val email: String,
    val phone: String,
    val password: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class VerifyEmailRequest(
    val email: String,
    val verificationCode: String
)

data class SendVerificationEmailRequest(
    val email: String
)

data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T? = null,
    val expiresAt: String? = null
)

// API endpoint tanımları
interface AuthApiService {
    @POST("register")
    suspend fun register(@Body request: RegisterRequest): ApiResponse<Any>
    
    @POST("login")
    suspend fun login(@Body request: LoginRequest): ApiResponse<Any>
    
    @POST("verify-email")
    suspend fun verifyEmail(@Body request: VerifyEmailRequest): ApiResponse<Any>
    
    @POST("send-verification-email")
    suspend fun sendVerificationEmail(@Body request: SendVerificationEmailRequest): ApiResponse<Any>
}

// Auth servisi sınıfı
class AuthService {
    private val TAG = "AuthService"
    
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl("http://10.0.2.2:3001/api/auth/") // Android emülatör için localhost
        .addConverterFactory(GsonConverterFactory.create())
        .client(client)
        .build()
    
    private val authApiService = retrofit.create(AuthApiService::class.java)
    
    suspend fun register(request: RegisterRequest): ApiResponse<Any> {
        return try {
            Log.d(TAG, "API isteği: register $request")
            val response = withContext(Dispatchers.IO) {
                authApiService.register(request)
            }
            Log.d(TAG, "API yanıtı: register $response")
            response
        } catch (e: Exception) {
            Log.e(TAG, "API hatası: register", e)
            handleApiError(e)
        }
    }
    
    suspend fun login(request: LoginRequest): ApiResponse<Any> {
        return try {
            Log.d(TAG, "API isteği: login $request")
            val response = withContext(Dispatchers.IO) {
                authApiService.login(request)
            }
            Log.d(TAG, "API yanıtı: login $response")
            response
        } catch (e: Exception) {
            Log.e(TAG, "API hatası: login", e)
            handleApiError(e)
        }
    }
    
    suspend fun verifyEmail(request: VerifyEmailRequest): ApiResponse<Any> {
        return try {
            Log.d(TAG, "API isteği: verifyEmail $request")
            val response = withContext(Dispatchers.IO) {
                authApiService.verifyEmail(request)
            }
            Log.d(TAG, "API yanıtı: verifyEmail $response")
            response
        } catch (e: Exception) {
            Log.e(TAG, "API hatası: verifyEmail", e)
            handleApiError(e)
        }
    }
    
    suspend fun sendVerificationEmail(email: String): ApiResponse<Any> {
        return try {
            Log.d(TAG, "API isteği: sendVerificationEmail $email")
            val response = withContext(Dispatchers.IO) {
                authApiService.sendVerificationEmail(SendVerificationEmailRequest(email))
            }
            Log.d(TAG, "API yanıtı: sendVerificationEmail $response")
            response
        } catch (e: Exception) {
            Log.e(TAG, "API hatası: sendVerificationEmail", e)
            handleApiError(e)
        }
    }
    
    private fun handleApiError(error: Exception): ApiResponse<Any> {
        // Retrofit ve OkHttp hata yönetimi
        return when (error) {
            is retrofit2.HttpException -> {
                val errorBody = error.response()?.errorBody()?.string()
                Log.e(TAG, "Sunucu yanıtı: ${error.code()}, $errorBody")
                ApiResponse(false, errorBody ?: "Sunucu hatası", null)
            }
            is java.net.SocketTimeoutException -> {
                Log.e(TAG, "Bağlantı zaman aşımına uğradı")
                ApiResponse(false, "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin ve backend servisinin çalıştığından emin olun.", null)
            }
            is java.io.IOException -> {
                Log.e(TAG, "İstek yapıldı ama yanıt alınamadı")
                ApiResponse(false, "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin ve backend servisinin çalıştığından emin olun.", null)
            }
            else -> {
                Log.e(TAG, "İstek hatası: ${error.message}")
                ApiResponse(false, error.message ?: "Bilinmeyen hata", null)
            }
        }
    }
} 