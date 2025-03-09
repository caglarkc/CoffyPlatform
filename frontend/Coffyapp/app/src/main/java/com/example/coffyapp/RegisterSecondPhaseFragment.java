package com.example.coffyapp;

import android.app.ProgressDialog;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class RegisterSecondPhaseFragment extends Fragment {
    public RegisterSecondPhaseFragment() {}

    EditText editTextEmail;
    Button buttonConfirmEmail;
    ProgressDialog progressDialog;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_register_second_phase, container, false);

        editTextEmail = view.findViewById(R.id.editTextEmail);
        buttonConfirmEmail = view.findViewById(R.id.buttonConfirmEmail);

        editTextEmail.addTextChangedListener(new TextWatcher() {
            private Handler handler = new Handler();
            private Runnable runnable;
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if (runnable != null) {
                    handler.removeCallbacks(runnable);
                }
                runnable = () -> {
                    String email = charSequence.toString().trim();

                    if (!email.isEmpty()) {
                        progressDialog = new ProgressDialog(getContext());
                        progressDialog.setMessage("Email kontrol ediliyor...");
                        progressDialog.setCancelable(false);
                        progressDialog.show();

                        RegisterActivity activity = (RegisterActivity) requireActivity();
                        activity.checkEmailAddress(email, exists -> {
                            if (progressDialog != null && progressDialog.isShowing()) {
                                progressDialog.dismiss();
                            }
                            if (exists) {
                                Toast.makeText(getContext(), "Bu email sistemde kayıtlı!", Toast.LENGTH_SHORT).show();
                                buttonConfirmEmail.setEnabled(false);
                            } else {
                                buttonConfirmEmail.setEnabled(true);
                            }
                        });
                    } else {
                        buttonConfirmEmail.setEnabled(false);
                    }
                };
                handler.postDelayed(runnable, 500);
            }

            @Override
            public void afterTextChanged(Editable editable) {}
        });

        editTextEmail.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                String email = editTextEmail.getText().toString();
                if (!TextUtils.isEmpty(email)) {
                    buttonConfirmEmail.setBackgroundResource(R.drawable.full_button_border);
                    buttonConfirmEmail.setTextColor(Color.WHITE);
                } else {
                    buttonConfirmEmail.setBackgroundResource(R.drawable.empty_button_border);
                    buttonConfirmEmail.setTextColor(getResources().getColor(R.color.dark_hint_color));
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });


        buttonConfirmEmail.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String email = editTextEmail.getText().toString();
                if (!TextUtils.isEmpty(email)) {
                    ((RegisterActivity) requireActivity()).getSecondPhase(email);
                }else {
                    Toast.makeText(getContext(),"Lütfen bir email giriniz!",Toast.LENGTH_SHORT).show();
                }

            }
        });

        return view;
    }
}
