package com.url_shortener.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.url_shortener.TestConfig;
import com.url_shortener.TestUtils;
import com.url_shortener.dto.CreateUrlRequest;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.UrlResponse;
import com.url_shortener.service.UrlService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UrlController.class)
@Import(TestConfig.class)
@ExtendWith(org.springframework.test.context.junit.jupiter.SpringExtension.class)
class UrlControllerTest {

    @MockBean
    private UrlService urlService;

    @Autowired
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void createShortUrl_Success() throws Exception {
        // Arrange
        CreateUrlRequest request = TestUtils.createUrlRequest();
        UrlResponse urlResponse = new UrlResponse();
        urlResponse.setId(1L);
        urlResponse.setOriginalUrl("https://example.com/very-long-url");
        urlResponse.setShortCode("abc123");
        urlResponse.setShortUrl("http://localhost:8080/s/abc123");
        urlResponse.setTitle("Test URL");

        ApiResponse<UrlResponse> apiResponse = ApiResponse.success("URL created successfully", urlResponse);
        when(urlService.createShortUrl(any(CreateUrlRequest.class), eq("test@example.com"))).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(post("/api/urls")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.shortCode").value("abc123"))
                .andExpect(jsonPath("$.data.originalUrl").value("https://example.com/very-long-url"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void createShortUrl_ValidationError() throws Exception {
        // Arrange
        CreateUrlRequest request = new CreateUrlRequest();
        request.setOriginalUrl("invalid-url");
        request.setOrganizationId(null); // Missing required field

        // Act & Assert
        mockMvc.perform(post("/api/urls")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getUserUrls_Success() throws Exception {
        // Arrange
        UrlResponse urlResponse = new UrlResponse();
        urlResponse.setId(1L);
        urlResponse.setOriginalUrl("https://example.com/very-long-url");
        urlResponse.setShortCode("abc123");

        Page<UrlResponse> urlPage = new PageImpl<>(Arrays.asList(urlResponse));
        ApiResponse<Page<UrlResponse>> apiResponse = ApiResponse.success(urlPage);
        when(urlService.getUserUrls(eq("test@example.com"), any(Pageable.class))).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/urls/my-urls")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].shortCode").value("abc123"))
                .andExpect(jsonPath("$.data.content[0].originalUrl").value("https://example.com/very-long-url"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getUserUrls_UserNotFound() throws Exception {
        // Arrange
        ApiResponse<Page<UrlResponse>> apiResponse = ApiResponse.error("User not found");
        when(urlService.getUserUrls(eq("test@example.com"), any(Pageable.class))).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/urls/my-urls")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("User not found"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void updateUrl_Success() throws Exception {
        // Arrange
        CreateUrlRequest request = TestUtils.createUrlRequest();
        UrlResponse urlResponse = new UrlResponse();
        urlResponse.setId(1L);
        urlResponse.setOriginalUrl("https://example.com/updated-url");
        urlResponse.setShortCode("abc123");
        urlResponse.setTitle("Updated URL");

        ApiResponse<UrlResponse> apiResponse = ApiResponse.success("URL updated successfully", urlResponse);
        when(urlService.updateUrl(eq(1L), any(CreateUrlRequest.class), eq("test@example.com"))).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(put("/api/urls/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Updated URL"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void updateUrl_UrlNotFound() throws Exception {
        // Arrange
        CreateUrlRequest request = TestUtils.createUrlRequest();
        ApiResponse<UrlResponse> apiResponse = ApiResponse.error("URL not found");
        when(urlService.updateUrl(eq(999L), any(CreateUrlRequest.class), eq("test@example.com"))).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(put("/api/urls/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("URL not found"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void deleteUrl_Success() throws Exception {
        // Arrange
        ApiResponse<String> apiResponse = ApiResponse.success("URL deleted successfully", null);
        when(urlService.deleteUrl(eq(1L), eq("test@example.com"))).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(delete("/api/urls/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("URL deleted successfully"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void deleteUrl_UrlNotFound() throws Exception {
        // Arrange
        ApiResponse<String> apiResponse = ApiResponse.error("URL not found");
        when(urlService.deleteUrl(eq(999L), eq("test@example.com"))).thenReturn(apiResponse);

        // Act & Assert
        mockMvc.perform(delete("/api/urls/999"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("URL not found"));
    }
} 