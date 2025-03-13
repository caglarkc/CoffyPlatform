package com.example.coffyapp;

public class MainMethods {

    public static boolean isPasswordStrongEnough(String password){
        if (password.length()<8){
            return false;
        }
        else if (!password.matches(".*[A-Z].*") || !password.matches(".*[a-z].*") || !password.matches(".*[0-9].*")) {
            return false;
        }
        else {
            return true;
        }
    }

    public static boolean isStringFormatted(String string) {
        if (string.length()<2) {
            return false;
        }
        if (string.matches(".*[0-9].*")) {
            return false;
        }
        else {
            return true;
        }
    }
}
