package com.example.coffyapp;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.InputType;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.google.gson.annotations.SerializedName;

import java.io.IOException;
import java.text.Annotation;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.TimeZone;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Converter;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public class RegisterActivity extends AppCompatActivity {

    String phone, name, surname, password, email;

    // Kullanıcı verisi için model sınıfı
    public static class RegisterRequest {
        @SerializedName("name")
        public String name;
        @SerializedName("surname")
        public String surname;
        @SerializedName("email")
        public String email;
        @SerializedName("phone")
        public String phone;
        @SerializedName("password")
        public String password;


        public RegisterRequest(String name, String surname, String email, String phone, String password) {
            this.name = name;
            this.surname = surname;
            this.email = email;
            this.phone = phone;
            this.password = password;

        }
    }

    public static class EmailRequest {
        @SerializedName("email")
        public String email;

        public EmailRequest(String email) {
            this.email = email;
        }
    }

    public static class VerifyRequest {
        @SerializedName("email")
        public String email;
        @SerializedName("code")
        public String code;

        public VerifyRequest(String email, String code) {
            this.email = email;
            this.code = code;
        }
    }

    public class VerificationResponse {
        @SerializedName("message")
        public String message;

        @SerializedName("expiresAt")
        public String expiresAt;

        @Override
        public String toString() {
            return "VerificationResponse{message='" + message + "', expiresAt=" + expiresAt + "}";
        }
    }

    public class User {
        @SerializedName("id")
        public String id;

        @SerializedName("name")
        public String name;

        @SerializedName("surname")
        public String surname;

        @SerializedName("email")
        public String email;

        @SerializedName("phone")
        public String phone;

        @SerializedName("createdAt")
        public String createdAt;

        @SerializedName("updatedAt")
        public String updatedAt;
    }

    public class VerifyResponse {
        @SerializedName("message")
        public String message;

        @SerializedName("user")
        public User user;

    }


    // API yanıtını işlemek için model sınıfı
    public static class RegisterResponse {
        @SerializedName("code")
        public int code;
        @SerializedName("message")
        public String message;
    }

    public static class CheckResponse {
        @SerializedName("exists")
        public boolean exists;
        @SerializedName("message")
        public String message;
    }

    public class VerifyErrorResponse {
        @SerializedName("success")
        public boolean success;

        @SerializedName("status")
        public int status;

        @SerializedName("message")
        public String message;

        @SerializedName("details")
        public Object details;

        @SerializedName("type")
        public String type;

        @SerializedName("timestamp")
        public String timestamp;
    }


    public interface AuthService {
        // Kayıt olma isteği (POST)
        @POST("register")
        Call<RegisterResponse> register(@Body RegisterRequest request);

        @GET("check-phone")
        Call<CheckResponse> checkPhone(@Query("phone") String phone);

        @GET("check-email")
        Call<CheckResponse> checkEmail(@Query("email") String email);

        // Yeni metod: Doğrulama emaili gönderme
        @POST("send-verification-email")
        Call<VerificationResponse> sendVerificationEmail(@Body EmailRequest emailRequest);

        @POST("verify-email")
        Call<VerifyResponse> verifyEmail(@Body VerifyRequest verifyRequest);


    }

    public interface OnCheckResultListener {
        void onResult(boolean exists);
    }

    // Listener arayüzü
    public interface OnVerificationSentListener {
        void onSent(long expiresAt);
    }

    AuthService apiService;
    Retrofit retrofit;


    @SuppressLint("ClickableViewAccessibility")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_register);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // Retrofit istemcisini oluştur
        retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3001/api/auth/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(AuthService.class);

        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.fragment_container, new RegisterFirstPhaseFragment())
                    .commit();
        }


    }

    public void getFirstPhase(String phone, String name, String surname, String password) {
        // Tüm kontroller başarılıysa
        this.phone = phone;
        this.name = name;
        this.surname = surname;
        this.password = password;


        Fragment fragment = new RegisterSecondPhaseFragment();
        goToFragment(fragment);
    }

    public void getSecondPhase(String email) {
        this.email = email;

        RegisterRequest registerRequest = new RegisterRequest(name, surname, this.email, phone, password);

        // API isteği
        Call<RegisterResponse> call = apiService.register(registerRequest);
        call.enqueue(new Callback<RegisterResponse>() {
            @Override
            public void onResponse(Call<RegisterResponse> call, Response<RegisterResponse> response) {
                Log.d("Erebus", response.toString());
                if (response.isSuccessful() && response.body() != null) {
                    String message = response.message();
                    String code = response.code() + "";
                    if (code.equals("201")) {
                        // Kayıt başarılıysa doğrulama emailini gönder
                        sendVerificationEmail(email, expiresAt -> {
                            if (expiresAt != -1) {
                                Toast.makeText(RegisterActivity.this, "Doğrulama kodu gönderildi!", Toast.LENGTH_SHORT).show();
                                Fragment fragment = new RegisterThirdPhaseFragment();
                                goToFragment(fragment); // Üçüncü faza geç
                            } else {
                                Toast.makeText(RegisterActivity.this, "Doğrulama kodu gönderilemedi!", Toast.LENGTH_SHORT).show();
                                // Hata durumunda üçüncü faza geçmek istemiyorsan burayı kaldırabilirsin
                                Fragment fragment = new RegisterThirdPhaseFragment();
                                goToFragment(fragment);
                            }
                        });
                    } else {
                        Toast.makeText(RegisterActivity.this, message, Toast.LENGTH_SHORT).show();
                        Log.e("EREBUS", "Hata: " + message);
                    }
                } else {
                    Toast.makeText(RegisterActivity.this, "Sunucu hatası: " + response.code(), Toast.LENGTH_SHORT).show();
                    Log.e("EREBUS", "İstek başarısız: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<RegisterResponse> call, Throwable t) {
                Toast.makeText(RegisterActivity.this, "Hata oluştu: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("EREBUS", "Hata oluştu: " + t.getMessage());
            }
        });
    }

    public void getThirdPhase(String code) {
        verifyEmail(code);
    }



    public void goToFragment(Fragment fragment) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.setCustomAnimations(
                R.anim.slide_in_right,
                R.anim.slide_out_left,
                R.anim.slide_in_left,
                R.anim.slide_out_right
        );
        transaction.replace(R.id.fragment_container, fragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }


    public void checkPhoneNumber(String phone, OnCheckResultListener listener) {
        Call<CheckResponse> call = apiService.checkPhone(phone);
        call.enqueue(new Callback<CheckResponse>() {
            @Override
            public void onResponse(Call<CheckResponse> call, Response<CheckResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    CheckResponse result = response.body();
                    listener.onResult(result.exists); // API yanıtına göre sonucu ilet
                } else {
                    listener.onResult(true); // Hata durumunda kayıtlıymış gibi davran
                }
            }

            @Override
            public void onFailure(Call<CheckResponse> call, Throwable t) {
                listener.onResult(true); // Bağlantı hatasında kayıtlıymış gibi davran
                Log.e("EREBUS", "Telefon kontrol hatası: " + t.getMessage());
            }
        });
    }

    public void checkEmailAddress(String email, OnCheckResultListener listener) {
        Call<CheckResponse> call = apiService.checkEmail(email);
        call.enqueue(new Callback<CheckResponse>() {
            @Override
            public void onResponse(Call<CheckResponse> call, Response<CheckResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    CheckResponse result = response.body();
                    listener.onResult(result.exists); // API yanıtına göre sonucu ilet
                } else {
                    listener.onResult(true); // Hata durumunda kayıtlıymış gibi davran
                }
            }

            @Override
            public void onFailure(Call<CheckResponse> call, Throwable t) {
                listener.onResult(true); // Bağlantı hatasında kayıtlıymış gibi davran
                Log.e("EREBUS", "Email kontrol hatası: " + t.getMessage());
            }
        });
    }

    public void sendVerificationEmail(String email, OnVerificationSentListener listener) {
        EmailRequest emailRequest = new EmailRequest(email);
        Call<VerificationResponse> call = apiService.sendVerificationEmail(emailRequest);
        call.enqueue(new Callback<VerificationResponse>() {
            @Override
            public void onResponse(Call<VerificationResponse> call, Response<VerificationResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    VerificationResponse verificationResponse = response.body();
                    Log.d("EREBUS", "Doğrulama emaili gönderildi: " + verificationResponse.message);
                    // Parse expiresAt string to long
                    long expiresAtLong = parseExpiresAt(verificationResponse.expiresAt);
                    listener.onSent(expiresAtLong);
                } else {
                    Toast.makeText(RegisterActivity.this, "Doğrulama emaili gönderilemedi: " + response.code(), Toast.LENGTH_SHORT).show();
                    Log.e("EREBUS", "Hata: " + response.code());
                    listener.onSent(-1); // Hata durumunda -1 gönder
                }
            }

            @Override
            public void onFailure(Call<VerificationResponse> call, Throwable t) {
                Toast.makeText(RegisterActivity.this, "Hata oluştu: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("EREBUS", "Hata: " + t.getMessage());
                listener.onSent(-1); // Hata durumunda -1 gönder
            }
        });
    }

    private long parseExpiresAt(String expiresAtStr) {
        if (expiresAtStr == null || expiresAtStr.isEmpty()) {
            return -1;
        }
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            Date date = sdf.parse(expiresAtStr);
            if (date != null) {
                return date.getTime(); // Returns timestamp in milliseconds
            } else {
                return -1;
            }
        } catch (ParseException e) {
            Log.e("EREBUS", "Failed to parse expiresAt: " + e.getMessage());
            return -1;
        }
    }


    private void verifyEmail(String code) {
        VerifyRequest verifyRequest = new VerifyRequest(email, code);
        Call<VerifyResponse> call = apiService.verifyEmail(verifyRequest);
        call.enqueue(new Callback<VerifyResponse>() {
            @Override
            public void onResponse(Call<VerifyResponse> call, Response<VerifyResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    // Başarılı yanıt
                    VerifyResponse verifyResponse = response.body();
                    Toast.makeText(RegisterActivity.this, verifyResponse.message, Toast.LENGTH_SHORT).show();
                    // Başarılı doğrulama sonrası kullanıcıyı yönlendirme (örneğin, giriş ekranına)
                    Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    // Başarısız yanıt
                    try {
                        Converter<ResponseBody, VerifyErrorResponse> converter =
                                retrofit.responseBodyConverter(VerifyErrorResponse.class, new java.lang.annotation.Annotation[0]);
                        VerifyErrorResponse errorResponse = converter.convert(response.errorBody());
                        Toast.makeText(RegisterActivity.this, errorResponse.message, Toast.LENGTH_SHORT).show();
                    } catch (IOException e) {
                        Toast.makeText(RegisterActivity.this, "Hata işlenemedi", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<VerifyResponse> call, Throwable t) {
                // Ağ hatası
                Toast.makeText(RegisterActivity.this, "Ağ hatası: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("EREBUS", "Ağ hatası: " + t.getMessage());
            }
        });
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        FragmentManager fragmentManager = getSupportFragmentManager();
        if (fragmentManager.getBackStackEntryCount() > 0) {
            fragmentManager.popBackStack();
        } else {
            Intent intent = new Intent(RegisterActivity.this,LoginActivity.class);
            startActivity(intent);
            finish();
        }
    }
}