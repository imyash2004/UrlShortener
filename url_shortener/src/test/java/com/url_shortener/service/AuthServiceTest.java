package com.url_shortener.service;

import com.url_shortener.TestUtils;
import com.url_shortener.config.JwtProvider;
import com.url_shortener.dto.SignInRequest;
import com.url_shortener.dto.SignUpRequest;
import com.url_shortener.entity.User;
import com.url_shortener.repository.UserRepository;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.AuthResponse;
import com.url_shortener.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtProvider jwtProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private SignUpRequest signUpRequest;
    private SignInRequest signInRequest;

    @BeforeEach
    void setUp() {
        testUser = TestUtils.createTestUser();
        signUpRequest = TestUtils.createSignUpRequest();
        signInRequest = TestUtils.createSignInRequest();
    }

    @Test
    void signUp_Success() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtProvider.generateToken(any())).thenReturn("jwt-token");

        // Act
        ApiResponse<AuthResponse> response = authService.signUp(signUpRequest);

        // Assert
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        assertEquals("test@example.com", response.getData().getEmail());
        verify(userRepository).existsByEmail("test@example.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void signUp_EmailAlreadyExists() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Act
        ApiResponse<AuthResponse> response = authService.signUp(signUpRequest);

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("already exists"));
        verify(userRepository).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void signIn_Success() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtProvider.generateToken(any())).thenReturn("jwt-token");

        // Act
        ApiResponse<AuthResponse> response = authService.signIn(signInRequest);

        // Assert
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        assertEquals("test@example.com", response.getData().getEmail());
        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).matches("password123", "encodedPassword");
    }

    @Test
    void signIn_UserNotFound() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act
        ApiResponse<AuthResponse> response = authService.signIn(signInRequest);

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Invalid email or password"));
        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void signIn_InvalidPassword() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // Act
        ApiResponse<AuthResponse> response = authService.signIn(signInRequest);

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Invalid email or password"));
        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).matches("password123", "encodedPassword");
    }

    @Test
    void getCurrentUser_Success() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        // Act
        ApiResponse<User> response = authService.getCurrentUser("test@example.com");

        // Assert
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        assertEquals("test@example.com", response.getData().getEmail());
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    void getCurrentUser_UserNotFound() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act
        ApiResponse<User> response = authService.getCurrentUser("test@example.com");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("User not found"));
        verify(userRepository).findByEmail("test@example.com");
    }
} 