package com.example.coffyapp;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class SecondPageFragment extends Fragment {
    public SecondPageFragment() {}

    Button buttonSkip;
    ImageButton imageButtonBack, imageButtonNext;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_second_page, container , false);

        buttonSkip = view.findViewById(R.id.buttonSkip);
        imageButtonBack = view.findViewById(R.id.imageButtonBack);
        imageButtonNext = view.findViewById(R.id.imageButtonNext);

        buttonSkip.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ((MainActivity) requireActivity()).goLoginPage();
            }
        });


        imageButtonBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Fragment fragment = new FirstPageFragment();
                ((MainActivity) requireActivity()).goBackToFragment(fragment);
            }
        });

        imageButtonNext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Fragment fragment = new ThirdPageFragment();
                ((MainActivity) requireActivity()).goToFragment(fragment);
            }
        });




        return view;
    }
}

