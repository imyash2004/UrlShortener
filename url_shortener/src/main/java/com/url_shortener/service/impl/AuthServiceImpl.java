package com.url_shortener.service.impl;

import com.url_shortener.config.JwtProvider;
import com.url_shortener.dto.*;
import com.url_shortener.entity.User;
import com.url_shortener.repository.UserRepository;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.AuthResponse;
import com.url_shortener.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    public ApiResponse<AuthResponse> signUp(SignUpRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.error("Email already exists");
            }

            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            User savedUser = userRepository.save(user);

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    savedUser.getEmail(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
            );

            String token = jwtProvider.generateToken(authentication);

            AuthResponse authResponse = new AuthResponse();
            authResponse.setToken(token);
            authResponse.setId(savedUser.getId());
            authResponse.setEmail(savedUser.getEmail());
            authResponse.setFirstName(savedUser.getFirstName());
            authResponse.setLastName(savedUser.getLastName());
            authResponse.setCreatedAt(savedUser.getCreatedAt());

            return ApiResponse.success("User registered successfully", authResponse);

        } catch (Exception e) {
            return ApiResponse.error("Registration failed: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<AuthResponse> signIn(SignInRequest request) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

            if (userOptional.isEmpty()) {
                return ApiResponse.error("Invalid email or password");
            }

            User user = userOptional.get();

            if (!user.isActive()) {
                return ApiResponse.error("Account is deactivated");
            }

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ApiResponse.error("Invalid email or password");
            }

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getEmail(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
            );

            String token = jwtProvider.generateToken(authentication);

            AuthResponse authResponse = new AuthResponse();
            authResponse.setToken(token);
            authResponse.setId(user.getId());
            authResponse.setEmail(user.getEmail());
            authResponse.setFirstName(user.getFirstName());
            authResponse.setLastName(user.getLastName());
            authResponse.setCreatedAt(user.getCreatedAt());

            return ApiResponse.success("Login successful", authResponse);

        } catch (Exception e) {
            return ApiResponse.error("Login failed: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<User> getCurrentUser(String email) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            User user = userOptional.get();
            user.setPassword(null); // Hide password

            return ApiResponse.success(user);

        } catch (Exception e) {
            return ApiResponse.error("Failed to get user: " + e.getMessage());
        }
    }
}
