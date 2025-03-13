package com.example.coffyapp;

import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.InputType;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class RegisterFirstPhaseFragment extends Fragment {
    public RegisterFirstPhaseFragment() {}

    ImageButton imageButtonShowPassword;
    Button buttonLogin, buttonContinue;
    EditText editTextPhone, editTextName, editTextSurname, editTextPassword;
    ProgressDialog progressDialog;

    @SuppressLint("ClickableViewAccessibility")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_register_first_phase, container , false);

        imageButtonShowPassword = view.findViewById(R.id.imageButtonShowPassword);
        buttonLogin = view.findViewById(R.id.buttonLogin);
        buttonContinue = view.findViewById(R.id.buttonContinue);
        editTextPhone = view.findViewById(R.id.editTextPhone);
        editTextName = view.findViewById(R.id.editTextName);
        editTextSurname = view.findViewById(R.id.editTextSurname);
        editTextPassword = view.findViewById(R.id.editTextPassword);


        editTextPhone.addTextChangedListener(new TextWatcher() {
            private Handler handler = new Handler();
            private Runnable runnable;

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (runnable != null) {
                    handler.removeCallbacks(runnable);
                }
                runnable = () -> {
                    String phone = s.toString().trim();
                    if (!phone.isEmpty() && phone.length() == 10 && !phone.startsWith("0")) {
                        progressDialog = new ProgressDialog(getContext());
                        progressDialog.setMessage("Telefon numarası kontrol ediliyor...");
                        progressDialog.setCancelable(false);
                        progressDialog.show();

                        RegisterActivity activity = (RegisterActivity) requireActivity();
                        activity.checkPhoneNumber(phone, exists -> {
                            if (progressDialog != null && progressDialog.isShowing()) {
                                progressDialog.dismiss();
                            }
                            if (exists) {
                                Toast.makeText(getContext(), "Bu telefon numarası sistemde kayıtlı!", Toast.LENGTH_SHORT).show();
                                buttonContinue.setBackgroundResource(R.drawable.empty_button_border);
                                buttonContinue.setTextColor(getResources().getColor(R.color.dark_hint_color));
                                buttonContinue.setEnabled(false);
                            } else {
                                buttonContinue.setBackgroundResource(R.drawable.full_button_border);
                                buttonContinue.setTextColor(Color.WHITE);
                                buttonContinue.setEnabled(true);
                            }
                        });
                    } else {
                        buttonContinue.setBackgroundResource(R.drawable.empty_button_border);
                        buttonContinue.setTextColor(getResources().getColor(R.color.dark_hint_color));
                        buttonContinue.setEnabled(false);
                    }
                };
                handler.postDelayed(runnable, 500);
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        editTextPhone.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                updateContinueButton();
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        editTextName.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                updateContinueButton();
            }

            @Override
            public void afterTextChanged(Editable editable) {}
        });

        editTextSurname.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                updateContinueButton();
            }

            @Override
            public void afterTextChanged(Editable editable) {}
        });

        editTextPassword.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                updateContinueButton();
            }

            @Override
            public void afterTextChanged(Editable editable) {}
        });

        imageButtonShowPassword.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
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
            }
        });



        buttonContinue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String phone = editTextPhone.getText().toString().trim();
                String name = editTextName.getText().toString().trim();
                String surname = editTextSurname.getText().toString().trim();
                String password = editTextPassword.getText().toString().trim();

                // 1. Tüm alanların dolu olup olmadığını kontrol et
                if (TextUtils.isEmpty(phone) || TextUtils.isEmpty(name) || TextUtils.isEmpty(surname) || TextUtils.isEmpty(password)) {
                    Toast.makeText(getContext(), "Bütün alanları doldurunuz!", Toast.LENGTH_SHORT).show();
                    return;
                }

                // 2. Telefon numarası doğrulaması: 10 haneli ve başında 0 olmamalı
                if (phone.length() != 10 || phone.startsWith("0")) {
                    Toast.makeText(getContext(), "Telefon numarası 10 haneli olmalıdır ve başına 0 koymayınız!", Toast.LENGTH_SHORT).show();
                    return;
                }

                // 3. İsim doğrulaması: En az 2 harf ve sadece harf içermeli
                if (!MainMethods.isStringFormatted(name)) {
                    Toast.makeText(getContext(), "İsim en az 2 harf içermeli ve sadece harflerden oluşmalıdır!", Toast.LENGTH_SHORT).show();
                    return;
                }

                // 4. Soyisim doğrulaması: En az 2 harf ve sadece harf içermeli
                if (!MainMethods.isStringFormatted(surname)) {
                    Toast.makeText(getContext(), "Soyisim en az 2 harf içermeli ve sadece harflerden oluşmalıdır!", Toast.LENGTH_SHORT).show();
                    return;
                }

                // 5. Şifre doğrulaması: En az 8 karakter, bir büyük harf, bir küçük harf ve bir sayı içermeli
                if (!MainMethods.isPasswordStrongEnough(password)) {
                    Toast.makeText(getContext(), "Şifre en az 8 karakter, bir büyük harf, bir küçük harf ve bir sayı içermelidir!", Toast.LENGTH_SHORT).show();
                    return;
                }



                ((RegisterActivity) requireActivity()).getFirstPhase(phone,name,surname,password);

            }
        });


        return view;
    }

    private void updateContinueButton() {
        // Her alanın boş olup olmadığını kontrol et
        boolean isPhoneFilled = !editTextPhone.getText().toString().isEmpty();
        boolean isNameFilled = !editTextName.getText().toString().isEmpty();
        boolean isSurnameFilled = !editTextSurname.getText().toString().isEmpty();
        boolean isPasswordFilled = !editTextPassword.getText().toString().isEmpty();

        // Tüm alanlar doluysa butonu aktif yap, değilse pasif yap
        if (isPhoneFilled && isNameFilled && isSurnameFilled && isPasswordFilled) {
            buttonContinue.setBackgroundResource(R.drawable.full_button_border);
            buttonContinue.setTextColor(Color.WHITE);
        } else {
            buttonContinue.setBackgroundResource(R.drawable.empty_button_border);
            buttonContinue.setTextColor(getResources().getColor(R.color.dark_hint_color));
        }
    }
}
