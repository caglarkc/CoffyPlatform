package com.example.coffyapp;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface AuthService {
    @POST("register")
    Call<Models.ResponseUser> register(@Body Models.RegisterRequest request);

    @GET("check-phone")
    Call<Models.ResponseCheck> checkPhone(@Query("phone") String phone);

    @GET("check-email")
    Call<Models.ResponseCheck> checkEmail(@Query("email") String email);

    @POST("send-verification-email")
    Call<Models.ResponseVerify> sendVerificationEmail(@Body Models.EmailRequest emailRequest);

    @POST("verify-email")
    Call<Models.ResponseVerify> verifyEmail(@Body Models.VerifyRequest verifyRequest);

    @POST("update-user")
    Call<Models.ResponseUser> updateUser(@Body Models.UpdateUser updateUser);

    @GET("update-user-unique-request")
    Call<Models.ResponseVerify> updateUserUniqueRequest(
            @Query("userId") String userId,
            @Query("data") String data,
            @Query("type") String type);

    @GET("verify-update-request")
    Call<Models.ResponseUser> verifyUniqueRequest(
            @Query("userId") String userId,
            @Query("code") String code,
            @Query("type") String type);

    @GET("login-with-email-send-code")
    Call<Models.ResponseCheck> loginWithEmailSendCode(@Query("email") String email);

    @GET("login-with-email-verify-code")
    Call<Models.ResponseUser> loginWithEmailVerifyCode(
            @Query("email") String email,
            @Query("code") String code);

    @GET("login-with-email-password")
    Call<Models.ResponseUser> loginWithEmailPassword(
            @Query("email") String email,
            @Query("password") String password);

    @GET("login-with-phone-password")
    Call<Models.ResponseUser> loginWithPhonePassword(
            @Query("phone") String phone,
            @Query("password") String password);

    @GET("get-user")
    Call<Models.ResponseUser> getUser
            (@Query("userId") String userId);

    @GET("cancel-update-request")
    Call<Models.ErrorResponse> cancelUpdateRequest (
            @Query("userId") String userId,
            @Query("type") String type);


}