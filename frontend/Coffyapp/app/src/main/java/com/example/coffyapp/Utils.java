package com.example.coffyapp;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;


public class Utils {
    public static long parseExpiresAt(String expiresAtStr) {
        if (expiresAtStr == null || expiresAtStr.isEmpty()) return -1;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            Date date = sdf.parse(expiresAtStr);
            return date != null ? date.getTime() : -1;
        } catch (ParseException e) {
            return -1;
        }
    }

}