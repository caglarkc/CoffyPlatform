package com.example.coffyapp;


import android.app.ProgressDialog;
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

import com.google.gson.Gson;

import java.io.IOException;
import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class SilinecekActivity extends AppCompatActivity {
    private static final String TAG = "Erebus";
    Button buttonSendCode, buttonEnter;
    EditText editTextEmail, editTextCode;

    AuthService authService;
    Retrofit retrofit;
    ProgressDialog progressDialog;

    SharedPreferences sharedPreferences;
    String userId;

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

        sharedPreferences = getSharedPreferences("user_data", MODE_PRIVATE);
        userId = sharedPreferences.getString("user_uid", "");

        progressDialog = new ProgressDialog(this);
        progressDialog.setMessage("İşleminiz gerçekleştiriliyor...");
        progressDialog.setCancelable(false);

        retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3001/api/auth/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        authService = retrofit.create(AuthService.class);

        editTextEmail = findViewById(R.id.editTextEmail);
        editTextCode = findViewById(R.id.editTextCode);

        buttonSendCode.setOnClickListener(view -> {
            Log.d(TAG, userId);
            String data = editTextEmail.getText().toString();

        });

        buttonEnter.setOnClickListener(view -> {

        });
    }









}