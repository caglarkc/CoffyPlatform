package com.example.coffyapp;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.text.Editable;
import android.text.InputType;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

public class UserUpdateUniqueFragment extends Fragment {

    //region View Bileşenleri
    private TextInputLayout textInputLayoutData;
    private TextInputEditText textInputEditTextData, textInputEditTextCode;
    private Button buttonPhone, buttonEmail, buttonCancel, buttonSave;
    //endregion

    //region Durum Değişkenleri
    private boolean isEmail = false;
    private boolean isSentCode = false;
    private String sentType = "";
    //endregion

    //region ProgressDialog
    private ProgressDialog progressDialog;
    //endregion

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_user_update_unique, container, false);

        // View bileşenlerini bağla
        initializeViews(view);

        // Başlangıç durumlarını ayarla
        setupInitialState();

        // Listener'ları ayarla
        setupListeners();

        return view;
    }

    //region Yardımcı Metotlar

    /** View bileşenlerini başlatır */
    private void initializeViews(View view) {
        textInputLayoutData = view.findViewById(R.id.textInputLayoutData);
        textInputEditTextData = view.findViewById(R.id.textInputEditTextData);
        textInputEditTextCode = view.findViewById(R.id.textInputEditTextCode);
        buttonPhone = view.findViewById(R.id.buttonPhone);
        buttonEmail = view.findViewById(R.id.buttonEmail);
        buttonCancel = view.findViewById(R.id.buttonCancel);
        buttonSave = view.findViewById(R.id.buttonSave);

        progressDialog = new ProgressDialog(getContext());
        progressDialog.setMessage("İşlem yapılıyor...");
        progressDialog.setCancelable(false);
    }

    /** Başlangıç durumlarını ayarlar */
    private void setupInitialState() {
        buttonSave.setEnabled(false);
        textInputEditTextCode.setEnabled(false);
        textInputLayoutData.setHint("Phone");
        textInputEditTextData.setInputType(InputType.TYPE_CLASS_NUMBER);
        updateButtonStyles(false);
    }

    /** Tüm listener'ları ayarlar */
    private void setupListeners() {
        buttonEmail.setOnClickListener(v -> switchToEmail());
        buttonPhone.setOnClickListener(v -> switchToPhone());
        buttonCancel.setOnClickListener(v -> handleCancel());
        buttonSave.setOnClickListener(v -> handleSave());

        textInputEditTextData.addTextChangedListener(new SimpleTextWatcher() {
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                validateDataInput(s.toString());
            }
        });

        textInputEditTextCode.addTextChangedListener(new SimpleTextWatcher() {
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                validateCodeInput(s.toString());
            }
        });
    }

    /** Email moduna geçiş yapar */
    private void switchToEmail() {
        if (!isEmail) {
            resetSentCode();
            isEmail = true;
            textInputLayoutData.setHint("Email");
            textInputEditTextData.setText("");
            textInputEditTextData.setInputType(InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
            updateButtonStyles(true);
        }
    }

    /** Telefon moduna geçiş yapar */
    private void switchToPhone() {
        if (isEmail) {
            resetSentCode();
            isEmail = false;
            textInputLayoutData.setHint("Phone");
            textInputEditTextData.setText("");
            textInputEditTextData.setInputType(InputType.TYPE_CLASS_NUMBER);
            updateButtonStyles(false);
        }
    }

    /** Buton stillerini günceller */
    private void updateButtonStyles(boolean isEmailSelected) {
        if (isEmailSelected) {
            buttonEmail.setTextColor(getContext().getColor(R.color.white));
            buttonEmail.setBackground(getContext().getDrawable(R.drawable.button_login_selected));
            buttonPhone.setTextColor(getContext().getColor(R.color.orange));
            buttonPhone.setBackground(null);
            buttonEmail.animate().alpha(1f).setDuration(200).start();
            buttonPhone.animate().alpha(0.5f).setDuration(200).start();
        } else {
            buttonPhone.setTextColor(getContext().getColor(R.color.white));
            buttonPhone.setBackground(getContext().getDrawable(R.drawable.button_login_selected));
            buttonEmail.setTextColor(getContext().getColor(R.color.orange));
            buttonEmail.setBackground(null);
            buttonPhone.animate().alpha(1f).setDuration(200).start();
            buttonEmail.animate().alpha(0.5f).setDuration(200).start();
        }
    }

    /** Veri girişini doğrular */
    private void validateDataInput(String data) {
        if (isEmail) {
            buttonSave.setEnabled(!TextUtils.isEmpty(data) && data.contains("@"));
        } else {
            buttonSave.setEnabled(!TextUtils.isEmpty(data) && data.length() == 10 && !data.startsWith("0"));
        }
    }

    /** Kod girişini doğrular */
    private void validateCodeInput(String code) {
        buttonSave.setEnabled(isSentCode && !TextUtils.isEmpty(code) && code.length() == 6);
    }

    /** Doğrulama kodunu sıfırlar */
    private void resetSentCode() {
        if (isSentCode && !sentType.isEmpty()) {
            isSentCode = false;
            sentType = "";
            Toast.makeText(getContext(), "Doğrulama iptal ediliyor...", Toast.LENGTH_SHORT).show();
            ((UserProfileActivity) requireActivity()).cancelUserUpdate(sentType, callback);
        }
    }

    /** İptal işlemini yönetir */
    private void handleCancel() {
        if (isSentCode && !sentType.isEmpty()) {
            resetSentCode();
        } else {
            Toast.makeText(getContext(), "Sayfadan çıkılıyor...", Toast.LENGTH_SHORT).show();
        }
        ((UserProfileActivity) requireActivity()).goBackToFragment(new UserProfileDetailsFragment());
    }

    /** Kaydetme işlemini yönetir */
    private void handleSave() {
        if (!isSentCode) {
            String data = textInputEditTextData.getText().toString();
            sentType = isEmail ? "email" : "phone";
            checkUniqueData(data, sentType);
        } else {
            String code = textInputEditTextCode.getText().toString();
            verifyCode(code, sentType);
        }
    }

    /** Benzersiz veri kontrolü yapar */
    private void checkUniqueData(String data, String type) {
        progressDialog.show();
        if (type.equals("email")) {
            ((UserProfileActivity) requireActivity()).checkEmailAddress(data, exists -> {
                progressDialog.dismiss();
                if (exists) {
                    Toast.makeText(getContext(), "Bu email sistemde kayıtlı!", Toast.LENGTH_SHORT).show();
                } else {
                    sendVerificationCode(data, type);
                }
            });
        } else {
            ((UserProfileActivity) requireActivity()).checkPhoneNumber(data, exists -> {
                progressDialog.dismiss();
                if (exists) {
                    Toast.makeText(getContext(), "Bu telefon numarası sistemde kayıtlı!", Toast.LENGTH_SHORT).show();
                } else {
                    sendVerificationCode(data, type);
                }
            });
        }
    }

    /** Doğrulama kodunu gönderir */
    private void sendVerificationCode(String data, String type) {
        progressDialog.show();
        ((UserProfileActivity) requireActivity()).updateUserUniqueRequest(data, type, new UserProfileActivity.SuccessCallback() {
            @Override
            public void onSuccess(String successMessage) {
                progressDialog.dismiss();
                isSentCode = true;
                Toast.makeText(getContext(), successMessage, Toast.LENGTH_SHORT).show();
                buttonSave.setText("Save");
                textInputEditTextData.setEnabled(false);
                textInputEditTextCode.setEnabled(true);
            }

            @Override
            public void onError(String errorMessage) {
                progressDialog.dismiss();
                Toast.makeText(getContext(), errorMessage, Toast.LENGTH_SHORT).show();
            }
        });
    }

    /** Doğrulama kodunu onaylar */
    private void verifyCode(String code, String type) {
        progressDialog.show();
        ((UserProfileActivity) requireActivity()).verifyUniqueRequest(code, type, new UserProfileActivity.SuccessCallback() {
            @Override
            public void onSuccess(String successMessage) {
                progressDialog.dismiss();
                Toast.makeText(getContext(), successMessage, Toast.LENGTH_SHORT).show();
                ((UserProfileActivity) requireActivity()).startUserProfileActivity();
            }

            @Override
            public void onError(String errorMessage) {
                progressDialog.dismiss();
                Toast.makeText(getContext(), errorMessage, Toast.LENGTH_SHORT).show();
                resetFragmentState();
            }
        });
    }

    /** Fragment durumunu sıfırlar */
    private void resetFragmentState() {
        isEmail = false;
        isSentCode = false;
        sentType = "";
        buttonSave.setEnabled(false);
        textInputEditTextCode.setEnabled(false);
        textInputLayoutData.setHint("Phone");
        textInputEditTextData.setInputType(InputType.TYPE_CLASS_NUMBER);
        updateButtonStyles(false);
    }

    /** Callback tanımı */
    private final UserProfileActivity.SuccessCallback callback = new UserProfileActivity.SuccessCallback() {
        @Override
        public void onSuccess(String successMessage) {
            Toast.makeText(getContext(), successMessage, Toast.LENGTH_SHORT).show();
        }

        @Override
        public void onError(String errorMessage) {
            Toast.makeText(getContext(), errorMessage, Toast.LENGTH_SHORT).show();
        }
    };

    //endregion

    //region TextWatcher Soyut Sınıfı
    private abstract static class SimpleTextWatcher implements TextWatcher {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

        @Override
        public void afterTextChanged(Editable s) {}
    }
    //endregion
}