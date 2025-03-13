package com.example.coffyapp;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

import java.io.IOException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.Query;

public class MenuActivity extends AppCompatActivity {
    Button buttonLogOut;
    SharedPreferences sharedUser;

    String userUid;

    public interface AuthService {
        @GET("logout")
        Call<LogoutResponse> logout(@Query("userId") String userId);
    }

    public static class LogoutResponse {
        @SerializedName("message")
        private String message;

        public String getMessage() {
            return message;
        }

        @Override
        public String toString() {
            return "LogoutResponse{" +
                    "message='" + message + '\'' +
                    '}';
        }
    }

    AuthService apiService;
    Retrofit retrofit;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_menu);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        buttonLogOut = findViewById(R.id.buttonLogOut);

        sharedUser = getSharedPreferences("user_data", MODE_PRIVATE);
        userUid = sharedUser.getString("user_uid","");

        // Retrofit istemcisini oluştur
        retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3001/api/auth/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(AuthService.class);


        buttonLogOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(userUid != null && !userUid.equals("")) {
                    logout(userUid);
                }
            }
        });
    }

    private void logout(String userId) {
        Call<LogoutResponse> call = apiService.logout(userId);
        call.enqueue(new Callback<LogoutResponse>() {
            @Override
            public void onResponse(Call<LogoutResponse> call, Response<LogoutResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    LogoutResponse logoutResponse = response.body();
                    Toast.makeText(MenuActivity.this, logoutResponse.getMessage(), Toast.LENGTH_SHORT).show();

                    // Kullanıcı oturumunu temizle ve login ekranına yönlendir
                    clearUserDataOnSystem();
                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            LogoutResponse errorResponse = gson.fromJson(errorBody, LogoutResponse.class);
                            Log.d("Erebus",errorResponse.getMessage());
                            Toast.makeText(MenuActivity.this, errorResponse.getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    } catch (IOException e) {
                        Toast.makeText(MenuActivity.this, "Çıkış yapılırken bir hata oluştu", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<LogoutResponse> call, Throwable t) {
                Toast.makeText(MenuActivity.this, "Ağ hatası: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void clearUserDataOnSystem() {
        sharedUser.edit().clear().apply();
        userUid = null;
    }
}