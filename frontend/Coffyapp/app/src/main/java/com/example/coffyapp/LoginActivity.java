package com.example.coffyapp;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.gson.annotations.SerializedName;

public class LoginActivity extends AppCompatActivity {
    Button buttonContinue, buttonRegister;
    EditText editTextPhone;

    public static class LoginRequest {
        public String phone;

        public LoginRequest(String phone) {
            this.phone = phone;
        }
    }



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

        buttonContinue = findViewById(R.id.buttonContinue);
        buttonRegister = findViewById(R.id.buttonRegister);
        editTextPhone = findViewById(R.id.editTextPhone);


        buttonRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(LoginActivity.this,RegisterActivity.class);
                startActivity(intent);
                finish();
            }
        });

        editTextPhone.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if(editTextPhone.getText().toString().length() == 10) {
                    buttonContinue.setBackgroundResource(R.drawable.full_button_border);
                    buttonContinue.setTextColor(Color.WHITE);
                } else {
                    buttonContinue.setBackgroundResource(R.drawable.empty_button_border);
                    buttonContinue.setTextColor(getResources().getColor(R.color.dark_hint_color));
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        buttonContinue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });
    }
}