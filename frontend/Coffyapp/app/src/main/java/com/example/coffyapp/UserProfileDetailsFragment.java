package com.example.coffyapp;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class UserProfileDetailsFragment extends Fragment {
    public UserProfileDetailsFragment() {}

    TextView textViewName, textViewSurname, textViewEmail, textViewPhone;
    Button buttonEditProfile, buttonEditProfileUnique;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_user_profile_details, container, false);

        textViewName = view.findViewById(R.id.textViewName);
        textViewSurname = view.findViewById(R.id.textViewSurname);
        textViewEmail = view.findViewById(R.id.textViewEmail);
        textViewPhone = view.findViewById(R.id.textViewPhone);
        buttonEditProfile = view.findViewById(R.id.buttonEditProfile);
        buttonEditProfileUnique = view.findViewById(R.id.buttonEditProfileUnique);


        // Kullanıcı bilgilerini yükle
        loadUserData();

        // **Fragment'tan dönerken güncelleme kontrolü ekle**
        getParentFragmentManager().setFragmentResultListener("updateRequest", this, (requestKey, bundle) -> {
            boolean updateSuccess = bundle.getBoolean("updateSuccess", false);
            if (updateSuccess) {
                loadUserData();
            }
        });



        buttonEditProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Fragment fragment = new UserUpdateFragment();
                ((UserProfileActivity) requireActivity()).goToFragment(fragment);
            }
        });

        buttonEditProfileUnique.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Fragment fragment = new UserUpdateUniqueFragment();
                ((UserProfileActivity) requireActivity()).goToFragment(fragment);
            }
        });



        return view;
    }

    // Kullanıcı verilerini yükleyen metod
    private void loadUserData() {
        Models.User user = ((UserProfileActivity) requireActivity()).getCurrentUser();
        textViewName.setText(user.name);
        textViewSurname.setText(user.surname);
        textViewEmail.setText(user.email);
        textViewPhone.setText(user.phone);
    }
}
