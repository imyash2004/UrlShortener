
package com.url_shortener.service.impl;

import com.url_shortener.dto.*;
import com.url_shortener.entity.*;
import com.url_shortener.repository.*;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.UrlResponse;
import com.url_shortener.service.OrganizationService;
import com.url_shortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UrlServiceImpl implements UrlService {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;
    private final OrganizationService organizationService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int SHORT_CODE_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    @Override
    public ApiResponse<UrlResponse> createShortUrl(CreateUrlRequest request, String userEmail) {
        try {
            // Validate organization access
            if (!organizationService.hasAccess(request.getOrganizationId(), userEmail)) {
                return ApiResponse.error("Access denied to this organization");
            }

            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Organization organization = organizationService.findOrganizationEntity(request.getOrganizationId());

            // Validate URL format
            if (!isValidUrl(request.getOriginalUrl())) {
                return ApiResponse.error("Invalid URL format");
            }

            // Generate or validate custom short code
            String shortCode;
            if (request.getCustomShortCode() != null && !request.getCustomShortCode().trim().isEmpty()) {
                shortCode = request.getCustomShortCode().trim();
                if (urlRepository.existsByShortCode(shortCode)) {
                    return ApiResponse.error("Custom short code already exists");
                }
                if (!isValidShortCode(shortCode)) {
                    return ApiResponse.error("Invalid short code format. Use only letters, numbers, and hyphens");
                }
            } else {
                shortCode = generateUniqueShortCode();
            }

            // Create URL entity
            Url url = new Url();
            url.setOriginalUrl(request.getOriginalUrl());
            url.setShortCode(shortCode);
            url.setShortUrl(baseUrl + "/s/" + shortCode);
            url.setTitle(request.getTitle());
            url.setDescription(request.getDescription());
            url.setExpiresAt(request.getExpiresAt());
            url.setCreatedBy(user);
            url.setOrganization(organization);

            Url savedUrl = urlRepository.save(url);
            UrlResponse response = mapToResponse(savedUrl);

            return ApiResponse.success("Short URL created successfully", response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to create short URL: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<String> redirectToOriginalUrl(String shortCode) {
        try {
            Optional<Url> urlOptional = urlRepository.findByShortCodeAndActiveTrue(shortCode);

            if (urlOptional.isEmpty()) {
                return ApiResponse.error("Short URL not found");
            }

            Url url = urlOptional.get();

            // Check if URL has expired
            if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
                return ApiResponse.error("Short URL has expired");
            }

            // Increment click count
            url.setClickCount(url.getClickCount() + 1);
            urlRepository.save(url);

            return ApiResponse.success("Redirect URL found", url.getOriginalUrl());

        } catch (Exception e) {
            return ApiResponse.error("Failed to process redirect: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<UrlResponse>> getUrlsByOrganization(Long organizationId, String userEmail, Pageable pageable) {
        try {
            if (!organizationService.hasAccess(organizationId, userEmail)) {
                return ApiResponse.error("Access denied to this organization");
            }

            Organization organization = organizationService.findOrganizationEntity(organizationId);
            Page<Url> urls = urlRepository.findByOrganizationAndActiveTrue(organization, pageable);
            Page<UrlResponse> response = urls.map(this::mapToResponse);

            return ApiResponse.success(response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to fetch URLs: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<UrlResponse>> getUserUrls(String userEmail, Pageable pageable) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Page<Url> urls = urlRepository.findByCreatedByAndActiveTrue(user, pageable);
            Page<UrlResponse> response = urls.map(this::mapToResponse);

            return ApiResponse.success(response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to fetch user URLs: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<UrlResponse> getUrlDetails(Long urlId, String userEmail) {
        try {
            Url url = urlRepository.findById(urlId)
                    .orElseThrow(() -> new RuntimeException("URL not found"));

            // Check access permissions
            if (!organizationService.hasAccess(url.getOrganization().getId(), userEmail)) {
                return ApiResponse.error("Access denied to this URL");
            }

            UrlResponse response = mapToResponse(url);
            return ApiResponse.success(response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to fetch URL details: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<String> deleteUrl(Long urlId, String userEmail) {
        try {
            Url url = urlRepository.findById(urlId)
                    .orElseThrow(() -> new RuntimeException("URL not found"));

            // Check access permissions
            if (!organizationService.hasAccess(url.getOrganization().getId(), userEmail)) {
                return ApiResponse.error("Access denied to this URL");
            }

            // Soft delete
            url.setActive(false);
            urlRepository.save(url);

            return ApiResponse.success("URL deleted successfully", null);

        } catch (Exception e) {
            return ApiResponse.error("Failed to delete URL: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<UrlResponse> updateUrl(Long urlId, CreateUrlRequest request, String userEmail) {
        try {
            Url url = urlRepository.findById(urlId)
                    .orElseThrow(() -> new RuntimeException("URL not found"));

            // Check access permissions
            if (!organizationService.hasAccess(url.getOrganization().getId(), userEmail)) {
                return ApiResponse.error("Access denied to this URL");
            }

            // Update fields
            url.setTitle(request.getTitle());
            url.setDescription(request.getDescription());
            url.setExpiresAt(request.getExpiresAt());

            // Handle custom short code update if provided
            if (request.getCustomShortCode() != null && !request.getCustomShortCode().trim().isEmpty()) {
                String newShortCode = request.getCustomShortCode().trim();
                if (!newShortCode.equals(url.getShortCode())) {
                    if (urlRepository.existsByShortCode(newShortCode)) {
                        return ApiResponse.error("Custom short code already exists");
                    }
                    if (!isValidShortCode(newShortCode)) {
                        return ApiResponse.error("Invalid short code format. Use only letters, numbers, and hyphens");
                    }
                    url.setShortCode(newShortCode);
                    url.setShortUrl(baseUrl + "/s/" + newShortCode);
                }
            }

            Url savedUrl = urlRepository.save(url);
            UrlResponse response = mapToResponse(savedUrl);

            return ApiResponse.success("URL updated successfully", response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to update URL: " + e.getMessage());
        }
    }

    private String generateUniqueShortCode() {
        String shortCode;
        do {
            shortCode = generateRandomString();
        } while (urlRepository.existsByShortCode(shortCode));
        return shortCode;
    }

    private String generateRandomString() {
        StringBuilder sb = new StringBuilder(SHORT_CODE_LENGTH);
        for (int i = 0; i < SHORT_CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    private boolean isValidUrl(String url) {
        return url != null &&
                !url.trim().isEmpty() &&
                (url.startsWith("http://") || url.startsWith("https://"));
    }

    private boolean isValidShortCode(String shortCode) {
        return shortCode != null &&
                shortCode.matches("^[a-zA-Z0-9-]+$") &&
                shortCode.length() >= 3 &&
                shortCode.length() <= 20;
    }

    private UrlResponse mapToResponse(Url url) {
        UrlResponse response = new UrlResponse();
        response.setId(url.getId());
        response.setOriginalUrl(url.getOriginalUrl());
        response.setShortCode(url.getShortCode());
        response.setShortUrl(url.getShortUrl());
        response.setTitle(url.getTitle());
        response.setDescription(url.getDescription());
        response.setClickCount(url.getClickCount());
        response.setCreatedAt(url.getCreatedAt());
        response.setExpiresAt(url.getExpiresAt());
        response.setActive(url.isActive());
        response.setCreatedByEmail(url.getCreatedBy().getEmail());
        response.setCreatedByName(url.getCreatedBy().getFirstName() + " " + url.getCreatedBy().getLastName());
        response.setOrganizationName(url.getOrganization().getName());

        return response;
    }
}