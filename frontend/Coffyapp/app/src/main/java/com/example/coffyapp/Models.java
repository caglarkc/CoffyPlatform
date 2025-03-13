package com.example.coffyapp;

import com.google.gson.annotations.SerializedName;

import java.util.HashMap;

public class Models {
    public static class RegisterRequest {
        @SerializedName("name") public String name;
        @SerializedName("surname") public String surname;
        @SerializedName("email") public String email;
        @SerializedName("phone") public String phone;
        @SerializedName("password") public String password;

        public RegisterRequest(String name, String surname, String email, String phone, String password) {
            this.name = name;
            this.surname = surname;
            this.email = email;
            this.phone = phone;
            this.password = password;
        }
    }

    public static class ResponseUser {
        @SerializedName("message") public String message;
        @SerializedName("user") public User user;

        @Override
        public String toString() {
            if (user != null) {
                return "ResponseUser{" +
                        "message='" + message + '\'' +
                        ", user=" + user.toString() +
                        '}';
            }
            return "ResponseUser{message='" + message + "', user=null}";
        }
    }

    public static class User {
        @SerializedName("id") public String id;
        @SerializedName("name") public String name;
        @SerializedName("surname") public String surname;
        @SerializedName("email") public String email;
        @SerializedName("phone") public String phone;

        @Override
        public String toString() {
            return "User{" +
                    "id='" + id + '\'' +
                    ", name='" + name + '\'' +
                    ", surname='" + surname + '\'' +
                    ", email='" + email + '\'' +
                    ", phone='" + phone + '\'' +
                    '}';
        }
    }

    public static class ResponseVerify {
        @SerializedName("message") public String message;
        @SerializedName("expiresAt") public String expiresAt;
    }

    public static class ResponseCheck {
        @SerializedName("message") public String message;
        @SerializedName("isExist") public boolean isExist;
        @SerializedName("expiresAt") public String expiresAt;
    }

    public static class EmailRequest {
        @SerializedName("email") public String email;

        public EmailRequest(String email) {
            this.email = email;
        }
    }

    public static class VerifyRequest {
        @SerializedName("email") public String email;
        @SerializedName("code") public String code;

        public VerifyRequest(String email, String code) {
            this.email = email;
            this.code = code;
        }
    }

    public static class ErrorResponse {
        @SerializedName("message") public String message;
    }

    public static class UpdateUser {
        @SerializedName("userId") public String userId;
        @SerializedName("name") public String name;
        @SerializedName("surname") public String surname;
        @SerializedName("email") public String email;

        public UpdateUser(String userId, String name, String surname, String email) {
            this.userId = userId;
            this.name = name;
            this.surname = surname;
            this.email = email;
        }
    }

}