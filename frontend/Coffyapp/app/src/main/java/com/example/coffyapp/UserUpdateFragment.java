package com.example.coffyapp;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
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

public class UserUpdateFragment extends Fragment {
    public UserUpdateFragment() {}

    TextInputEditText textInputEditTextName, textInputEditTextSurname, textInputEditTextPassword;
    TextInputLayout TextInputLayoutName, TextInputLayoutSurname;
    Button buttonCancel, buttonSave;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_user_update, container, false);

        textInputEditTextName = view.findViewById(R.id.textInputEditTextName);
        textInputEditTextSurname = view.findViewById(R.id.textInputEditTextSurname);
        textInputEditTextPassword = view.findViewById(R.id.textInputEditTextPassword);
        TextInputLayoutName = view.findViewById(R.id.TextInputLayoutName);
        TextInputLayoutSurname = view.findViewById(R.id.TextInputLayoutSurname);
        buttonCancel = view.findViewById(R.id.buttonCancel);
        buttonSave = view.findViewById(R.id.buttonSave);

        Models.User user = ((UserProfileActivity) requireActivity()).getCurrentUser();

        TextInputLayoutName.setHint(user.name);
        TextInputLayoutSurname.setHint(user.surname);


        buttonCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Fragment fragment = new UserProfileDetailsFragment();
                ((UserProfileActivity) requireActivity()).goBackToFragment(fragment);
            }
        });

        buttonSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String name = textInputEditTextName.getText().toString().trim().isEmpty() ? "default" : textInputEditTextName.getText().toString();
                String surname = textInputEditTextSurname.getText().toString().trim().isEmpty() ? "default" : textInputEditTextSurname.getText().toString();
                String password = textInputEditTextPassword.getText().toString().trim().isEmpty() ? "default" : textInputEditTextPassword.getText().toString();

                if (!TextUtils.isEmpty(name) && !TextUtils.isEmpty(surname) && !TextUtils.isEmpty(password)) {
                    ((UserProfileActivity) requireActivity()).updateUser(name, surname, password, new UserProfileActivity.SuccessCallback() {
                        @Override
                        public void onSuccess(String successMessage) {
                            Toast.makeText(getContext(),successMessage,Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onError(String errorMessage) {
                            Toast.makeText(getContext(),errorMessage,Toast.LENGTH_SHORT).show();
                        }
                    });
                }
            }
        });



        return view;
    }

    private void isAbleClick() {
        if (!TextUtils.isEmpty(textInputEditTextName.getText().toString())
                && !TextUtils.isEmpty(textInputEditTextSurname.getText().toString())
                && !TextUtils.isEmpty(textInputEditTextPassword.getText().toString()) ) {
            buttonSave.setEnabled(true);
        }else {
            buttonSave.setEnabled(false);
        }
    }
}
