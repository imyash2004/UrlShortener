package com.url_shortener.service;

import com.url_shortener.TestUtils;
import com.url_shortener.dto.CreateUrlRequest;
import com.url_shortener.entity.Organization;
import com.url_shortener.entity.Url;
import com.url_shortener.entity.User;
import com.url_shortener.repository.UrlRepository;
import com.url_shortener.repository.UserRepository;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.UrlResponse;
import com.url_shortener.service.impl.UrlServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UrlServiceTest {

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizationService organizationService;

    @InjectMocks
    private UrlServiceImpl urlService;

    private User testUser;
    private Organization testOrganization;
    private Url testUrl;
    private CreateUrlRequest createUrlRequest;

    @BeforeEach
    void setUp() {
        testUser = TestUtils.createTestUser();
        testOrganization = TestUtils.createTestOrganization();
        testUrl = TestUtils.createTestUrl();
        createUrlRequest = TestUtils.createUrlRequest();
    }

    @Test
    void createShortUrl_Success() {
        // Arrange
        when(organizationService.hasAccess(any(), anyString())).thenReturn(true);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(organizationService.findOrganizationEntity(any())).thenReturn(testOrganization);
        when(urlRepository.existsByOrganizationAndOriginalUrl(any(), anyString())).thenReturn(false);
        when(urlRepository.existsByOrganizationAndShortCodeAndActiveTrue(any(), anyString())).thenReturn(false);
        when(urlRepository.save(any(Url.class))).thenReturn(testUrl);

        // Act
        ApiResponse<UrlResponse> response = urlService.createShortUrl(createUrlRequest, "test@example.com");

        // Assert
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        verify(organizationService).hasAccess(1L, "test@example.com");
        verify(organizationService).findOrganizationEntity(1L);
        verify(urlRepository).save(any(Url.class));
    }

    @Test
    void createShortUrl_NoAccessToOrganization() {
        // Arrange
        when(organizationService.hasAccess(any(), anyString())).thenReturn(false);

        // Act
        ApiResponse<UrlResponse> response = urlService.createShortUrl(createUrlRequest, "test@example.com");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Access denied"));
        verify(organizationService).hasAccess(1L, "test@example.com");
        verify(urlRepository, never()).save(any(Url.class));
    }

    @Test
    void createShortUrl_InvalidUrl() {
        // Arrange
        createUrlRequest.setOriginalUrl("invalid-url");
        when(organizationService.hasAccess(any(), anyString())).thenReturn(true);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(organizationService.findOrganizationEntity(any())).thenReturn(testOrganization);

        // Act
        ApiResponse<UrlResponse> response = urlService.createShortUrl(createUrlRequest, "test@example.com");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Invalid URL format"));
        verify(urlRepository, never()).save(any(Url.class));
    }

    @Test
    void getUserUrls_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Url> urlPage = new PageImpl<>(Arrays.asList(testUrl));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(urlRepository.findByCreatedByAndActiveTrue(any(User.class), any(Pageable.class))).thenReturn(urlPage);

        // Act
        ApiResponse<Page<UrlResponse>> response = urlService.getUserUrls("test@example.com", pageable);

        // Assert
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        assertEquals(1, response.getData().getContent().size());
        verify(userRepository).findByEmail("test@example.com");
        verify(urlRepository).findByCreatedByAndActiveTrue(testUser, pageable);
    }

    @Test
    void getUserUrls_UserNotFound() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act
        ApiResponse<Page<UrlResponse>> response = urlService.getUserUrls("test@example.com", pageable);

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("User not found"));
        verify(userRepository).findByEmail("test@example.com");
        verify(urlRepository, never()).findByCreatedByAndActiveTrue(any(), any());
    }

    @Test
    void updateUrl_Success() {
        // Arrange
        when(urlRepository.findByIdAndActiveTrue(any())).thenReturn(Optional.of(testUrl));
        when(organizationService.hasAccess(any(), anyString())).thenReturn(true);
        when(urlRepository.save(any(Url.class))).thenReturn(testUrl);

        // Act
        ApiResponse<UrlResponse> response = urlService.updateUrl(1L, createUrlRequest, "test@example.com");

        // Assert
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        verify(urlRepository).findByIdAndActiveTrue(1L);
        verify(organizationService).hasAccess(1L, "test@example.com");
        verify(urlRepository).save(any(Url.class));
    }

    @Test
    void updateUrl_UrlNotFound() {
        // Arrange
        when(urlRepository.findByIdAndActiveTrue(any())).thenReturn(Optional.empty());

        // Act
        ApiResponse<UrlResponse> response = urlService.updateUrl(1L, createUrlRequest, "test@example.com");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("URL not found"));
        verify(urlRepository).findByIdAndActiveTrue(1L);
        verify(urlRepository, never()).save(any(Url.class));
    }

    @Test
    void updateUrl_NoAccess() {
        // Arrange
        when(urlRepository.findByIdAndActiveTrue(any())).thenReturn(Optional.of(testUrl));
        when(organizationService.hasAccess(any(), anyString())).thenReturn(false);

        // Act
        ApiResponse<UrlResponse> response = urlService.updateUrl(1L, createUrlRequest, "test@example.com");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Access denied"));
        verify(urlRepository).findByIdAndActiveTrue(1L);
        verify(organizationService).hasAccess(1L, "test@example.com");
        verify(urlRepository, never()).save(any(Url.class));
    }

    @Test
    void deleteUrl_Success() {
        // Arrange
        when(urlRepository.findById(any())).thenReturn(Optional.of(testUrl));
        when(organizationService.hasAccess(any(), anyString())).thenReturn(true);

        // Act
        ApiResponse<String> response = urlService.deleteUrl(1L, "test@example.com");

        // Assert
        assertTrue(response.isSuccess());
        assertTrue(response.getMessage().contains("deleted successfully"));
        verify(urlRepository).findById(1L);
        verify(organizationService).hasAccess(1L, "test@example.com");
        verify(urlRepository).delete(testUrl);
    }

    @Test
    void deleteUrl_UrlNotFound() {
        // Arrange
        when(urlRepository.findById(any())).thenReturn(Optional.empty());

        // Act
        ApiResponse<String> response = urlService.deleteUrl(1L, "test@example.com");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("URL not found"));
        verify(urlRepository).findById(1L);
        verify(urlRepository, never()).save(any(Url.class));
    }

    @Test
    void redirectToOriginalUrl_Success() {
        // Arrange
        when(urlRepository.findByShortCodeAndActiveTrue(anyString())).thenReturn(Optional.of(testUrl));
        when(urlRepository.save(any(Url.class))).thenReturn(testUrl);

        // Act
        ApiResponse<String> response = urlService.redirectToOriginalUrl("abc123");

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("https://example.com/very-long-url", response.getData());
        verify(urlRepository).findByShortCodeAndActiveTrue("abc123");
        verify(urlRepository).save(any(Url.class));
    }

    @Test
    void redirectToOriginalUrl_UrlNotFound() {
        // Arrange
        when(urlRepository.findByShortCodeAndActiveTrue(anyString())).thenReturn(Optional.empty());

        // Act
        ApiResponse<String> response = urlService.redirectToOriginalUrl("invalid");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("not found"));
        verify(urlRepository).findByShortCodeAndActiveTrue("invalid");
        verify(urlRepository, never()).save(any(Url.class));
    }
} 