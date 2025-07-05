package com.url_shortener.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.url_shortener.dto.SignInRequest;
import com.url_shortener.dto.SignUpRequest;
import com.url_shortener.entity.User;
import com.url_shortener.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class AuthIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void signUp_Success() throws Exception {
        // Arrange
        SignUpRequest request = new SignUpRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setFirstName("New");
        request.setLastName("User");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.data.firstName").value("New"))
                .andExpect(jsonPath("$.data.lastName").value("User"))
                .andExpect(jsonPath("$.data.token").exists());

        // Verify user was saved in database
        User savedUser = userRepository.findByEmail("newuser@example.com").orElse(null);
        assertNotNull(savedUser);
        assertEquals("New", savedUser.getFirstName());
        assertEquals("User", savedUser.getLastName());
    }

    @Test
    void signUp_DuplicateEmail() throws Exception {
        // Arrange - Create user first
        User existingUser = new User();
        existingUser.setEmail("existing@example.com");
        existingUser.setPassword(passwordEncoder.encode("password123"));
        existingUser.setFirstName("Existing");
        existingUser.setLastName("User");
        existingUser.setActive(true);
        userRepository.save(existingUser);

        SignUpRequest request = new SignUpRequest();
        request.setEmail("existing@example.com");
        request.setPassword("password123");
        request.setFirstName("New");
        request.setLastName("User");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email already exists"));
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
        // Arrange - Create user first
        User user = new User();
        user.setEmail("testuser@example.com");
        user.setPassword(passwordEncoder.encode("password123")); // Proper BCrypt encoding
        user.setFirstName("Test");
        user.setLastName("User");
        user.setActive(true);
        userRepository.save(user);

        SignInRequest request = new SignInRequest();
        request.setEmail("testuser@example.com");
        request.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("testuser@example.com"))
                .andExpect(jsonPath("$.data.token").exists());
    }

    @Test
    void signIn_UserNotFound() throws Exception {
        // Arrange
        SignInRequest request = new SignInRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    void signIn_InvalidPassword() throws Exception {
        // Arrange - Create user first
        User user = new User();
        user.setEmail("testuser@example.com");
        user.setPassword(passwordEncoder.encode("password123")); // Proper BCrypt encoding
        user.setFirstName("Test");
        user.setLastName("User");
        user.setActive(true);
        userRepository.save(user);

        SignInRequest request = new SignInRequest();
        request.setEmail("testuser@example.com");
        request.setPassword("wrongpassword");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
} 