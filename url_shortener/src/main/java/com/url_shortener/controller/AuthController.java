package com.url_shortener.controller;

import com.url_shortener.dto.*;
import com.url_shortener.entity.User;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.AuthResponse;
import com.url_shortener.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signUp(@Valid @RequestBody SignUpRequest request) {
        ApiResponse<AuthResponse> response = authService.signUp(request);
        // Return 200 for business logic errors, 400 only for validation errors
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<AuthResponse>> signIn(@Valid @RequestBody SignInRequest request) {
        ApiResponse<AuthResponse> response = authService.signIn(request);
        // Return 200 for business logic errors, 400 only for validation errors
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        ApiResponse<User> response = authService.getCurrentUser(email);
        // Return 200 for business logic errors, 400 only for validation errors
        return ResponseEntity.ok(response);
    }
}