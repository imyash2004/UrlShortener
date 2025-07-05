package com.url_shortener.service;

import com.url_shortener.TestUtils;
import com.url_shortener.dto.CreateOrganizationRequest;
import com.url_shortener.entity.Organization;
import com.url_shortener.entity.User;
import com.url_shortener.entity.UserOrganization;
import com.url_shortener.repository.OrganizationRepository;
import com.url_shortener.repository.UserOrganizationRepository;
import com.url_shortener.repository.UserRepository;
import com.url_shortener.repository.UrlRepository;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.OrganizationResponse;
import com.url_shortener.service.impl.OrganizationServiceImpl;
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
class OrganizationServiceTest {

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserOrganizationRepository userOrganizationRepository;

    @Mock
    private UrlRepository urlRepository;

    @InjectMocks
    private OrganizationServiceImpl organizationService;

    private User testUser;
    private Organization testOrganization;
    private UserOrganization testUserOrganization;
    private CreateOrganizationRequest createOrganizationRequest;

    @BeforeEach
    void setUp() {
        testUser = TestUtils.createTestUser();
        testOrganization = TestUtils.createTestOrganization();
        testUserOrganization = new UserOrganization();
        testUserOrganization.setId(1L);
        testUserOrganization.setUser(testUser);
        testUserOrganization.setOrganization(testOrganization);
        testUserOrganization.setRole(UserOrganization.Role.OWNER);
        testUserOrganization.setActive(true);
        createOrganizationRequest = TestUtils.createOrganizationRequest();
    }

    @Test
    void createOrganization_Success() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(organizationRepository.save(any(Organization.class))).thenReturn(testOrganization);
        when(userOrganizationRepository.save(any(UserOrganization.class))).thenReturn(testUserOrganization);
        when(urlRepository.countByOrganizationAndActiveTrue(any(Organization.class))).thenReturn(0L);

        // Act
        ApiResponse<OrganizationResponse> response = organizationService.createOrganization(createOrganizationRequest, "test@example.com");

        // Assert
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        assertEquals("Test Organization", response.getData().getName());
        verify(userRepository).findByEmail("test@example.com");
        verify(organizationRepository).save(any(Organization.class));
        verify(userOrganizationRepository).save(any(UserOrganization.class));
    }

    @Test
    void createOrganization_UserNotFound() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act
        ApiResponse<OrganizationResponse> response = organizationService.createOrganization(createOrganizationRequest, "test@example.com");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("User not found"));
        verify(userRepository).findByEmail("test@example.com");
        verify(organizationRepository, never()).save(any(Organization.class));
    }

    @Test
    void getUserOrganizations_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Organization> orgPage = new PageImpl<>(Arrays.asList(testOrganization));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(organizationRepository.findUserOrganizations(any(User.class), any(Pageable.class))).thenReturn(orgPage);
        when(urlRepository.countByOrganizationAndActiveTrue(any(Organization.class))).thenReturn(0L);

        // Act
        ApiResponse<Page<OrganizationResponse>> response = organizationService.getUserOrganizations("test@example.com", pageable);

        // Assert
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        assertEquals(1, response.getData().getContent().size());
        verify(userRepository).findByEmail("test@example.com");
        verify(organizationRepository).findUserOrganizations(testUser, pageable);
    }

    @Test
    void getUserOrganizations_UserNotFound() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        when(userRepository.findByEmail(anyString())).thenThrow(new RuntimeException("User not found"));

        // Act
        ApiResponse<Page<OrganizationResponse>> response = organizationService.getUserOrganizations("test@example.com", pageable);

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("User not found"));
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    void hasAccess_OwnerAccess() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(organizationRepository.findByIdAndActiveTrue(any())).thenReturn(Optional.of(testOrganization));
        when(userOrganizationRepository.existsByUserAndOrganizationAndActiveTrue(any(User.class), any(Organization.class))).thenReturn(true);

        // Act
        boolean hasAccess = organizationService.hasAccess(1L, "test@example.com");

        // Assert
        assertTrue(hasAccess);
        verify(userRepository).findByEmail("test@example.com");
        verify(organizationRepository).findByIdAndActiveTrue(1L);
    }

    @Test
    void hasAccess_NoAccess() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(organizationRepository.findByIdAndActiveTrue(any())).thenReturn(Optional.of(testOrganization));
        when(userOrganizationRepository.existsByUserAndOrganizationAndActiveTrue(any(User.class), any(Organization.class))).thenReturn(false);

        // Act
        boolean hasAccess = organizationService.hasAccess(1L, "test@example.com");

        // Assert
        assertFalse(hasAccess);
        verify(userRepository).findByEmail("test@example.com");
        verify(organizationRepository).findByIdAndActiveTrue(1L);
    }

    @Test
    void findOrganizationEntity_Success() {
        // Arrange
        when(organizationRepository.findByIdAndActiveTrue(any())).thenReturn(Optional.of(testOrganization));

        // Act
        Organization result = organizationService.findOrganizationEntity(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test Organization", result.getName());
        verify(organizationRepository).findByIdAndActiveTrue(1L);
    }

    @Test
    void findOrganizationEntity_NotFound() {
        // Arrange
        when(organizationRepository.findByIdAndActiveTrue(any())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            organizationService.findOrganizationEntity(1L);
        });
        verify(organizationRepository).findByIdAndActiveTrue(1L);
    }

    @Test
    void hasAccess_OwnerUser() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(organizationRepository.findByIdAndActiveTrue(any())).thenReturn(Optional.of(testOrganization));
        // User is owner of the organization
        testOrganization.setOwner(testUser);

        // Act
        boolean hasAccess = organizationService.hasAccess(1L, "test@example.com");

        // Assert
        assertTrue(hasAccess);
        verify(userRepository).findByEmail("test@example.com");
        verify(organizationRepository).findByIdAndActiveTrue(1L);
    }
} 