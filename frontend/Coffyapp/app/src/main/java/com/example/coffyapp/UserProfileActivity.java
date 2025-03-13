package com.example.coffyapp;

import android.app.ProgressDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
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

public class UserProfileActivity extends AppCompatActivity {
    SharedPreferences sharedUser;
    String sharedUserId;
    AuthService authService;
    Retrofit retrofit;

    // Kullanıcı bilgilerini saklamak için alan
    private Models.User currentUser;

    public interface UserCallback {
        void onSuccess(Models.User user);
        void onError(String errorMessage);
    }

    public interface SuccessCallback {
        void onSuccess(String successMessage);
        void onError(String errorMessage);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_user_profile);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        sharedUser = getSharedPreferences("user_data", MODE_PRIVATE);
        sharedUserId = sharedUser.getString("user_uid", "");

        retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3001/api/auth/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        authService = retrofit.create(AuthService.class);

        // Kullanıcı bilgilerini çek ve fragmentleri yalnızca başarı durumunda yükle
        getUser(new UserCallback() {
            @Override
            public void onSuccess(Models.User user) {
                currentUser = user; // Kullanıcı bilgilerini sakla
                if (savedInstanceState == null) {
                    getSupportFragmentManager().beginTransaction()
                            .add(R.id.fragment_container, new UserProfileDetailsFragment())
                            .commit();
                }
            }

            @Override
            public void onError(String errorMessage) {
                Toast.makeText(UserProfileActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
                // Hata durumunda fragment yüklenmez
            }
        });
    }

    public String getId() {
        return sharedUserId;
    }

    // getUser metodu (değişmeden kalabilir)
    public void getUser(UserCallback callback) {
        Call<Models.ResponseUser> call = authService.getUser(sharedUserId);
        call.enqueue(new Callback<Models.ResponseUser>() {
            @Override
            public void onResponse(Call<Models.ResponseUser> call, Response<Models.ResponseUser> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseUser result = response.body();
                    if (result.user != null) {
                        callback.onSuccess(result.user);
                    } else {
                        callback.onError("Kullanıcı bulunamadı");
                    }
                    Log.d("Erebus", "Response: " + result.toString());
                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            Models.ErrorResponse errorResponse = gson.fromJson(errorBody, Models.ErrorResponse.class);
                            callback.onError(errorResponse.message);
                        } else {
                            callback.onError("Bilinmeyen bir hata oluştu");
                        }
                    } catch (IOException e) {
                        callback.onError("Bir hata oluştu: " + e.getMessage());
                    }
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseUser> call, Throwable t) {
                callback.onError("Ağ hatası: " + t.getMessage());
            }
        });
    }

    // Fragmentlere kullanıcı bilgilerini sağlamak için bir getter
    public Models.User getCurrentUser() {
        return currentUser;
    }

    public void updateUser(String name, String surname, String password, SuccessCallback callback) {
        // UpdateUserRequest nesnesini oluştur
        Models.UpdateUser request = new Models.UpdateUser(sharedUserId, name, surname, password);

        // API çağrısını yap
        AuthService apiService = retrofit.create(AuthService.class);
        Call<Models.ResponseUser> call = apiService.updateUser(request);

        call.enqueue(new Callback<Models.ResponseUser>() {
            @Override
            public void onResponse(Call<Models.ResponseUser> call, Response<Models.ResponseUser> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseUser result = response.body();
                    if (result.message != null) {
                        callback.onSuccess(result.message);
                    }
                    Toast.makeText(UserProfileActivity.this, result.message, Toast.LENGTH_SHORT).show();
                    Log.d("UpdateUser", "Kullanıcı güncellendi: " + result.toString());
                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            Models.ErrorResponse errorResponse = gson.fromJson(errorBody, Models.ErrorResponse.class);
                            callback.onError(errorResponse.message);
                        } else {
                            callback.onError("Bilinmeyen bir hata oluştu");
                        }
                    } catch (IOException e) {
                        callback.onError("Bir hata oluştu: " + e.getMessage());
                    }
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseUser> call, Throwable t) {
                Toast.makeText(UserProfileActivity.this, "Hata: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.d("erebus", t.getMessage());
            }
        });
    }



    public void updateUserUniqueRequest(String data, String type, SuccessCallback callback ) {
        Call<Models.ResponseVerify> call = authService.updateUserUniqueRequest(sharedUserId, data, type);
        call.enqueue(new Callback<Models.ResponseVerify>() {
            @Override
            public void onResponse(Call<Models.ResponseVerify> call, Response<Models.ResponseVerify> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseVerify result = response.body();
                    if (result.expiresAt != null) {
                        String m = "Message: " +result.message + "\nExpires At: " + result.expiresAt;
                        callback.onSuccess(m);
                    }else {
                        callback.onError(result.message);
                    }

                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            Models.ErrorResponse errorResponse = gson.fromJson(errorBody, Models.ErrorResponse.class);
                            Toast.makeText(UserProfileActivity.this, errorResponse.message, Toast.LENGTH_SHORT).show();
                        }
                    } catch (IOException e) {
                        Toast.makeText(UserProfileActivity.this, "Bir hata oluştu", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseVerify> call, Throwable t) {
                Toast.makeText(UserProfileActivity.this, t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void verifyUniqueRequest(String code, String type, SuccessCallback callback) {
        Call<Models.ResponseUser> call = authService.verifyUniqueRequest(sharedUserId, code, type);
        call.enqueue(new Callback<Models.ResponseUser>() {
            @Override
            public void onResponse(Call<Models.ResponseUser> call, Response<Models.ResponseUser> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseUser result = response.body();
                    if (result.user != null) {
                        String m = "Message: " + result.message + "\nUser: " + result.user.toString();
                        callback.onSuccess(m);
                    }else {
                        callback.onError(result.message);
                    }
                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            Models.ErrorResponse errorResponse = gson.fromJson(errorBody, Models.ErrorResponse.class);
                            Toast.makeText(UserProfileActivity.this, errorResponse.message, Toast.LENGTH_SHORT).show();
                        }
                    } catch (IOException e) {
                        Toast.makeText(UserProfileActivity.this, "Bir hata oluştu", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseUser> call, Throwable t) {
                Toast.makeText(UserProfileActivity.this, t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void cancelUserUpdate(String type, SuccessCallback callback) {
        Call<Models.ErrorResponse> call = authService.cancelUpdateRequest(sharedUserId, type);
        call.enqueue(new Callback<Models.ErrorResponse>() {
            @Override
            public void onResponse(Call<Models.ErrorResponse> call, Response<Models.ErrorResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Models.ErrorResponse result = response.body();
                    if (result.message != null) {
                        callback.onSuccess(result.message);
                    }else {
                        callback.onError(result.message);
                    }
                    Log.d("Erebus", "Response: " + result.toString());
                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            Models.ErrorResponse errorResponse = gson.fromJson(errorBody, Models.ErrorResponse.class);
                            callback.onError(errorResponse.message);
                        } else {
                            callback.onError("Bilinmeyen bir hata oluştu");
                        }
                    } catch (IOException e) {
                        callback.onError("Bir hata oluştu: " + e.getMessage());
                    }
                }
            }

            @Override
            public void onFailure(Call<Models.ErrorResponse> call, Throwable t) {
                callback.onError("Ağ hatası: " + t.getMessage());
            }
        });
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

    public void goBackToFragment(Fragment fragment) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.setCustomAnimations(
                R.anim.slide_in_left,
                R.anim.slide_out_right,
                R.anim.slide_in_right,
                R.anim.slide_out_left
        );
        transaction.replace(R.id.fragment_container, fragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    public void startUserProfileActivity() {
        Intent intent = getIntent();
        finish(); // Mevcut aktiviteyi kapat
        startActivity(intent); // Yeniden başlat
    }

    public void checkPhoneNumber(String phone, RegisterActivity.OnCheckResultListener listener) {
        Call<Models.ResponseCheck> call = authService.checkPhone(phone);
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
        Call<Models.ResponseCheck> call = authService.checkEmail(email);
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

    @Override
    public void onBackPressed() {
        FragmentManager fragmentManager = getSupportFragmentManager();
        if (fragmentManager.getBackStackEntryCount() > 0) {
            fragmentManager.popBackStack();
        } else {
            super.onBackPressed();
        }
    }
}