package com.url_shortener.service;

import com.url_shortener.dto.*;
import com.url_shortener.entity.User;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.AuthResponse;

public interface AuthService {
    ApiResponse<AuthResponse> signUp(SignUpRequest request);
    ApiResponse<AuthResponse> signIn(SignInRequest request);
    ApiResponse<User> getCurrentUser(String email);
}
