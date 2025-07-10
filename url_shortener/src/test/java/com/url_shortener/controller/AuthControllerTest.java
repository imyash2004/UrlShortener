package com.url_shortener.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.url_shortener.TestConfig;
import com.url_shortener.TestUtils;
import com.url_shortener.dto.SignInRequest;
import com.url_shortener.dto.SignUpRequest;
import com.url_shortener.entity.User;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.AuthResponse;
import com.url_shortener.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import(TestConfig.class)
@ExtendWith(org.springframework.test.context.junit.jupiter.SpringExtension.class)
class AuthControllerTest {

    @MockBean
    private AuthService authService;

    @Autowired
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void signUp_Success() throws Exception {
        // Arrange
        SignUpRequest request = TestUtils.createSignUpRequest();
        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken("jwt-token");
        authResponse.setEmail("test@example.com");
        authResponse.setFirstName("John");
        authResponse.setLastName("Doe");

        ApiResponse<AuthResponse> apiResponse = ApiResponse.success("User registered successfully", authResponse);
        when(authService.signUp(any(SignUpRequest.class))).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("test@example.com"))
                .andExpect(jsonPath("$.data.token").value("jwt-token"));
    }

    @Test
    void signUp_ValidationError() throws Exception {
        // Arrange
        SignUpRequest request = new SignUpRequest();
        request.setEmail("invalid-email");
        request.setPassword("123"); // Too short
        request.setFirstName(""); // Empty
        request.setLastName(""); // Empty

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signIn_Success() throws Exception {
        // Arrange
        SignInRequest request = TestUtils.createSignInRequest();
        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken("jwt-token");
        authResponse.setEmail("test@example.com");

        ApiResponse<AuthResponse> apiResponse = ApiResponse.success("Login successful", authResponse);
        when(authService.signIn(any(SignInRequest.class))).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("test@example.com"))
                .andExpect(jsonPath("$.data.token").value("jwt-token"));
    }

    @Test
    void signIn_InvalidCredentials() throws Exception {
        // Arrange
        SignInRequest request = TestUtils.createSignInRequest();
        ApiResponse<AuthResponse> apiResponse = ApiResponse.error("Invalid email or password");
        when(authService.signIn(any(SignInRequest.class))).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getCurrentUser_Success() throws Exception {
        // Arrange
        User user = TestUtils.createTestUser();
        user.setPassword(null); // Hide password
        ApiResponse<User> apiResponse = ApiResponse.success(user);
        when(authService.getCurrentUser("test@example.com")).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("test@example.com"))
                .andExpect(jsonPath("$.data.firstName").value("John"))
                .andExpect(jsonPath("$.data.lastName").value("Doe"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getCurrentUser_UserNotFound() throws Exception {
        // Arrange
        ApiResponse<User> apiResponse = ApiResponse.error("User not found");
        when(authService.getCurrentUser("test@example.com")).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("User not found"));
    }
} 