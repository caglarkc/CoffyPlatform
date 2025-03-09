package com.example.coffyapp;

import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class RegisterThirdPhaseFragment extends Fragment {
    public RegisterThirdPhaseFragment() {}

    EditText editTextCode;
    Button buttonConfirmEmail;


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_register_third_phase, container, false);

        editTextCode = view.findViewById(R.id.editTextCode);
        buttonConfirmEmail = view.findViewById(R.id.buttonConfirmEmail);

        editTextCode.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                String code = editTextCode.getText().toString();
                if (!TextUtils.isEmpty(code)) {
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
                String code = editTextCode.getText().toString();
                if (code.length() == 6) {
                    ((RegisterActivity) requireActivity()).getThirdPhase(code);
                }else {
                    Toast.makeText(getContext(),"Lütfen 6 haneli doğrulama kodunu giriniz!",Toast.LENGTH_SHORT).show();
                }
            }
        });

        return view;
    }
}
