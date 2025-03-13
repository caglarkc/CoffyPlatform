package com.example.coffyapp;

import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.InputType;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.gson.Gson;

import java.io.IOException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class LoginActivity extends AppCompatActivity {
    Button buttonContinue, buttonRegister, buttonPhoneLogin, buttonEmailLogin, buttonLoginWithCode;
    EditText editTextLoginField, editTextPassword;
    ImageButton imageButtonShowPassword;
    TextView textViewLoginCapital, textViewPassword;

    ProgressDialog progressDialog;

    SharedPreferences sharedPreferences;
    SharedPreferences.Editor editor;

    boolean isEmail = false, isLoginWithCode = false, isCodeSent = false;

    AuthService apiService;
    Retrofit retrofit;

    @SuppressLint("ClickableViewAccessibility")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_login);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        sharedPreferences = getSharedPreferences("user_data", MODE_PRIVATE);
        editor = sharedPreferences.edit();

        buttonContinue = findViewById(R.id.buttonContinue);
        buttonRegister = findViewById(R.id.buttonRegister);
        editTextLoginField = findViewById(R.id.editTextLoginField);
        editTextPassword = findViewById(R.id.editTextPassword);
        imageButtonShowPassword = findViewById(R.id.imageButtonShowPassword);
        buttonPhoneLogin = findViewById(R.id.buttonPhoneLogin);
        buttonEmailLogin = findViewById(R.id.buttonEmailLogin);
        textViewLoginCapital = findViewById(R.id.textViewLoginCapital);
        buttonLoginWithCode = findViewById(R.id.buttonLoginWithCode);
        textViewPassword = findViewById(R.id.textViewPassword);

        buttonLoginWithCode.setVisibility(View.GONE);

        retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3001/api/auth/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(AuthService.class);

        imageButtonShowPassword.setOnTouchListener((view, motionEvent) -> {
            switch (motionEvent.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    imageButtonShowPassword.setBackgroundResource(R.drawable.eye_icon);
                    editTextPassword.setInputType(InputType.TYPE_CLASS_TEXT);
                    return true;
                case MotionEvent.ACTION_UP:
                    editTextPassword.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                    imageButtonShowPassword.setBackgroundResource(R.drawable.eye_visible_icon);
                    return true;
            }
            return false;
        });

        buttonRegister.setOnClickListener(view -> {
            Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
            startActivity(intent);
            finish();
        });

        TextWatcher textWatcher = new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                updateButtonState();
            }

            @Override
            public void afterTextChanged(android.text.Editable s) {}
        };
        editTextLoginField.addTextChangedListener(textWatcher);
        editTextPassword.addTextChangedListener(textWatcher);

        buttonPhoneLogin.setOnClickListener(view -> {
            if (isEmail) {
                isEmail = false;
                editTextLoginField.setHint("Telefon Numarası");
                textViewLoginCapital.setText("Telefon Numarası");
                editTextLoginField.setInputType(InputType.TYPE_CLASS_NUMBER);
                editTextPassword.setEnabled(true);
                editTextLoginField.setEnabled(true);
                buttonLoginWithCode.setVisibility(View.GONE);
                buttonPhoneLogin.setTextColor(getColor(R.color.white));
                buttonPhoneLogin.setBackground(getDrawable(R.drawable.button_login_selected));
                buttonEmailLogin.setTextColor(getColor(R.color.orange));
                buttonEmailLogin.setBackground(null);
                buttonPhoneLogin.animate().alpha(1f).setDuration(200).start();
                buttonEmailLogin.animate().alpha(0.5f).setDuration(200).start();
            }
        });

        buttonEmailLogin.setOnClickListener(view -> {
            if (!isEmail) {
                isEmail = true;
                editTextLoginField.setHint("Email");
                textViewLoginCapital.setText("Email");
                editTextLoginField.setInputType(InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
                buttonLoginWithCode.setVisibility(View.VISIBLE);
                buttonEmailLogin.setTextColor(getColor(R.color.white));
                buttonEmailLogin.setBackground(getDrawable(R.drawable.button_login_selected));
                buttonPhoneLogin.setTextColor(getColor(R.color.orange));
                buttonPhoneLogin.setBackground(null);
                buttonEmailLogin.animate().alpha(1f).setDuration(200).start();
                buttonPhoneLogin.animate().alpha(0.5f).setDuration(200).start();
            }
        });

        buttonLoginWithCode.setOnClickListener(view -> {
            if (isEmail) {
                textViewPassword.setText("Güvenlik Kodu");
                editTextPassword.setHint("6 Haneli Kod");
                editTextPassword.setText("");
                isLoginWithCode = true;
                if (!isCodeSent) {
                    editTextPassword.setEnabled(false);
                }
            }
        });

        buttonContinue.setOnClickListener(view -> {
            String data = editTextLoginField.getText().toString();
            String password = editTextPassword.getText().toString();
            progressDialog = new ProgressDialog(LoginActivity.this);
            progressDialog.setMessage("Giriş yapılıyor...");
            progressDialog.setCancelable(false);
            progressDialog.show();
            if (isLoginWithCode) {
                if (!isCodeSent) {
                    if (!TextUtils.isEmpty(data)) {
                        progressDialog.setMessage("Kod gönderiliyor...");
                        loginWithEmailSendCode(data);
                    } else {
                        Toast.makeText(LoginActivity.this, "Lütfen email adresini giriniz.", Toast.LENGTH_SHORT).show();
                        progressDialog.dismiss();
                    }
                } else {
                    loginWithEmailVerifyCode(data, password);
                }
            } else {
                if (isEmail) {
                    loginWithEmailPassword(data, password);
                } else {
                    loginWithPhonePassword(data, password);
                }
            }
        });
    }

    private void updateButtonState() {
        if (isEmail) {
            if (isLoginWithCode) {
                if (!TextUtils.isEmpty(editTextLoginField.getText().toString())) {
                    buttonContinue.setBackgroundResource(R.drawable.full_button_border);
                    buttonContinue.setTextColor(Color.WHITE);
                    buttonContinue.setEnabled(true);
                } else {
                    buttonContinue.setBackgroundResource(R.drawable.empty_button_border);
                    buttonContinue.setEnabled(false);
                    buttonContinue.setTextColor(getResources().getColor(R.color.dark_hint_color));
                }
            } else {
                if (!TextUtils.isEmpty(editTextLoginField.getText().toString()) && !TextUtils.isEmpty(editTextPassword.getText().toString())) {
                    buttonContinue.setBackgroundResource(R.drawable.full_button_border);
                    buttonContinue.setEnabled(true);
                    buttonContinue.setTextColor(Color.WHITE);
                } else {
                    buttonContinue.setBackgroundResource(R.drawable.empty_button_border);
                    buttonContinue.setEnabled(false);
                    buttonContinue.setTextColor(getResources().getColor(R.color.dark_hint_color));
                }
            }
        } else {
            if (editTextLoginField.getText().toString().length() == 10 && !TextUtils.isEmpty(editTextPassword.getText().toString())) {
                buttonContinue.setBackgroundResource(R.drawable.full_button_border);
                buttonContinue.setEnabled(true);
                buttonContinue.setTextColor(Color.WHITE);
            } else {
                buttonContinue.setBackgroundResource(R.drawable.empty_button_border);
                buttonContinue.setEnabled(false);
                buttonContinue.setTextColor(getResources().getColor(R.color.dark_hint_color));
            }
        }
    }

    private void loginWithEmailSendCode(String email) {
        Call<Models.ResponseCheck> call = apiService.loginWithEmailSendCode(email);
        call.enqueue(new Callback<Models.ResponseCheck>() {
            @Override
            public void onResponse(Call<Models.ResponseCheck> call, Response<Models.ResponseCheck> response) {
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                }
                if (response.isSuccessful() && response.body() != null) {
                    isCodeSent = true;
                    editTextLoginField.setEnabled(false);
                    editTextPassword.setEnabled(true);
                    Models.ResponseCheck checkResponse = response.body();
                    Toast.makeText(LoginActivity.this, checkResponse.message, Toast.LENGTH_SHORT).show();
                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            Models.ErrorResponse errorResponse = gson.fromJson(errorBody, Models.ErrorResponse.class);
                            Toast.makeText(LoginActivity.this, errorResponse.message, Toast.LENGTH_SHORT).show();
                        }
                    } catch (IOException e) {
                        Toast.makeText(LoginActivity.this, "Bir hata oluştu", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseCheck> call, Throwable t) {
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                }
                Toast.makeText(LoginActivity.this, "Ağ hatası: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void loginWithEmailVerifyCode(String email, String code) {
        Call<Models.ResponseUser> call = apiService.loginWithEmailVerifyCode(email, code);
        call.enqueue(new Callback<Models.ResponseUser>() {
            @Override
            public void onResponse(Call<Models.ResponseUser> call, Response<Models.ResponseUser> response) {
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                }
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseUser checkResponse = response.body();
                    Toast.makeText(LoginActivity.this, checkResponse.message, Toast.LENGTH_SHORT).show();
                    if (checkResponse.user != null) {
                        String uid = checkResponse.user.id;
                        editor.putString("user_uid", uid);
                        editor.apply();
                        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                        startActivity(intent);
                        finish();
                    }
                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            Models.ErrorResponse errorResponse = gson.fromJson(errorBody, Models.ErrorResponse.class);
                            Toast.makeText(LoginActivity.this, errorResponse.message, Toast.LENGTH_SHORT).show();
                        }
                    } catch (IOException e) {
                        Toast.makeText(LoginActivity.this, "Bir hata oluştu", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseUser> call, Throwable t) {
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                }
                Toast.makeText(LoginActivity.this, "Ağ hatası: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void loginWithEmailPassword(String email, String password) {
        Call<Models.ResponseUser> call = apiService.loginWithEmailPassword(email, password);
        call.enqueue(new Callback<Models.ResponseUser>() {
            @Override
            public void onResponse(Call<Models.ResponseUser> call, Response<Models.ResponseUser> response) {
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                }
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseUser checkResponse = response.body();
                    Toast.makeText(LoginActivity.this, checkResponse.message, Toast.LENGTH_SHORT).show();
                    if (checkResponse.user != null) {
                        String uid = checkResponse.user.id;
                        editor.putString("user_uid", uid);
                        editor.apply();
                        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                        startActivity(intent);
                        finish();
                    }
                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            Models.ErrorResponse errorResponse = gson.fromJson(errorBody, Models.ErrorResponse.class);
                            Toast.makeText(LoginActivity.this, errorResponse.message, Toast.LENGTH_SHORT).show();
                        }
                    } catch (IOException e) {
                        Toast.makeText(LoginActivity.this, "Bir hata oluştu", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseUser> call, Throwable t) {
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                }
                Toast.makeText(LoginActivity.this, "Ağ hatası: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void loginWithPhonePassword(String phone, String password) {
        Call<Models.ResponseUser> call = apiService.loginWithPhonePassword(phone, password);
        call.enqueue(new Callback<Models.ResponseUser>() {
            @Override
            public void onResponse(Call<Models.ResponseUser> call, Response<Models.ResponseUser> response) {
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                }
                if (response.isSuccessful() && response.body() != null) {
                    Models.ResponseUser checkResponse = response.body();
                    if (checkResponse.user != null) {
                        String uid = checkResponse.user.id;
                        editor.putString("user_uid", uid);
                        editor.apply();
                        Toast.makeText(LoginActivity.this, checkResponse.message, Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(LoginActivity.this, MenuActivity.class);
                        startActivity(intent);
                        finish();
                    }
                } else {
                    try {
                        if (response.errorBody() != null) {
                            String errorBody = response.errorBody().string();
                            Gson gson = new Gson();
                            Models.ErrorResponse errorResponse = gson.fromJson(errorBody, Models.ErrorResponse.class);
                            Toast.makeText(LoginActivity.this, errorResponse.message, Toast.LENGTH_SHORT).show();
                        }
                    } catch (IOException e) {
                        Toast.makeText(LoginActivity.this, "Bir hata oluştu", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Models.ResponseUser> call, Throwable t) {
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                }
                Toast.makeText(LoginActivity.this, "Ağ hatası: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}