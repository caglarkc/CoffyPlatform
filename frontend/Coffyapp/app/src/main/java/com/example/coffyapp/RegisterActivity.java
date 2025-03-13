package com.example.coffyapp;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.google.gson.Gson;

import java.io.IOException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RegisterActivity extends AppCompatActivity {
    String phone, name, surname, password, email;

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
        this.phone = phone;
        this.name = name;
        this.surname = surname;
        this.password = password;
        Fragment fragment = new RegisterSecondPhaseFragment();
        goToFragment(fragment);
    }

    public void getSecondPhase(String email) {
        this.email = email;
        Models.RegisterRequest registerRequest = new Models.RegisterRequest(name, surname, this.email, phone, password);
        Call<Models.ResponseUser> call = apiService.register(registerRequest);
        call.enqueue(new Callback<Models.ResponseUser>() {
            @Override
            public void onResponse(Call<Models.ResponseUser> call, Response<Models.ResponseUser> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseUser responseUser = response.body();
                    String message = responseUser.message;
                    Models.User user = responseUser.user;
                    if (response.code() == 201) {
                        sendVerificationEmail(email, expiresAt -> {
                            if (expiresAt != -1) {
                                Toast.makeText(RegisterActivity.this, message, Toast.LENGTH_SHORT).show();
                                Log.d("Erebus", "Kullanıcı bilgileri: " + user.toString());
                                Fragment fragment = new RegisterThirdPhaseFragment();
                                goToFragment(fragment);
                            } else {
                                Toast.makeText(RegisterActivity.this, "Doğrulama kodu gönderilemedi!", Toast.LENGTH_SHORT).show();
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
            public void onFailure(Call<Models.ResponseUser> call, Throwable t) {
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

    public void checkPhoneNumber(String phone, RegisterActivity.OnCheckResultListener listener) {
        Call<Models.ResponseCheck> call = apiService.checkPhone(phone);
        call.enqueue(new Callback<Models.ResponseCheck>() {
            @Override
            public void onResponse(Call<Models.ResponseCheck> call, Response<Models.ResponseCheck> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseCheck result = response.body();
                    listener.onResult(result.isExist);
                } else {
                    listener.onResult(true);
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseCheck> call, Throwable t) {
                listener.onResult(true);
                Log.e("EREBUS", "Telefon kontrol hatası: " + t.getMessage());
            }
        });
    }

    public void checkEmailAddress(String email, RegisterActivity.OnCheckResultListener listener) {
        Call<Models.ResponseCheck> call = apiService.checkEmail(email);
        call.enqueue(new Callback<Models.ResponseCheck>() {
            @Override
            public void onResponse(Call<Models.ResponseCheck> call, Response<Models.ResponseCheck> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseCheck result = response.body();
                    listener.onResult(result.isExist);
                } else {
                    listener.onResult(true);
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseCheck> call, Throwable t) {
                listener.onResult(true);
                Log.e("EREBUS", "Email kontrol hatası: " + t.getMessage());
            }
        });
    }

    public void sendVerificationEmail(String email, RegisterActivity.OnVerificationSentListener listener) {
        Models.EmailRequest emailRequest = new Models.EmailRequest(email);
        Call<Models.ResponseVerify> call = apiService.sendVerificationEmail(emailRequest);
        call.enqueue(new Callback<Models.ResponseVerify>() {
            @Override
            public void onResponse(Call<Models.ResponseVerify> call, Response<Models.ResponseVerify> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseVerify verificationResponse = response.body();
                    Log.d("EREBUS", "Doğrulama emaili gönderildi: " + verificationResponse.message);
                    long expiresAtLong = Utils.parseExpiresAt(verificationResponse.expiresAt);
                    listener.onSent(expiresAtLong);
                } else {
                    Toast.makeText(RegisterActivity.this, "Doğrulama emaili gönderilemedi: " + response.code(), Toast.LENGTH_SHORT).show();
                    Log.e("EREBUS", "Hata: " + response.code());
                    listener.onSent(-1);
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseVerify> call, Throwable t) {
                Toast.makeText(RegisterActivity.this, "Hata oluştu: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("EREBUS", "Hata: " + t.getMessage());
                listener.onSent(-1);
            }
        });
    }

    private void verifyEmail(String code) {
        Models.VerifyRequest verifyRequest = new Models.VerifyRequest(email, code);
        Call<Models.ResponseVerify> call = apiService.verifyEmail(verifyRequest);
        call.enqueue(new Callback<Models.ResponseVerify>() {
            @Override
            public void onResponse(Call<Models.ResponseVerify> call, Response<Models.ResponseVerify> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseVerify verifyResponse = response.body();
                    Toast.makeText(RegisterActivity.this, verifyResponse.message, Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            Models.ErrorResponse errorResponse = gson.fromJson(errorBody, Models.ErrorResponse.class);
                            Toast.makeText(RegisterActivity.this, errorResponse.message, Toast.LENGTH_SHORT).show();
                        }
                    } catch (IOException e) {
                        Toast.makeText(RegisterActivity.this, "Bir hata oluştu", Toast.LENGTH_SHORT).show();
                        Log.e("EREBUS", "Hata mesajı parse edilemedi: " + e.getMessage());
                    }
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseVerify> call, Throwable t) {
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
            Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
            startActivity(intent);
            finish();
        }
    }

    public interface OnCheckResultListener {
        void onResult(boolean exists);
    }

    public interface OnVerificationSentListener {
        void onSent(long expiresAt);
    }
}