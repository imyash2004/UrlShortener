package com.url_shortener.service;

import com.url_shortener.dto.*;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.UrlResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UrlService {
    ApiResponse<UrlResponse> createShortUrl(CreateUrlRequest request, String userEmail);

    ApiResponse<String> redirectToOriginalUrl(String shortCode);
    
    ApiResponse<String> redirectToOriginalUrlByOrgAndId(Long organizationId, Long urlId);

    ApiResponse<String> redirectToOriginalUrlByRandomPrefixAndOrgAndId(String randomPrefix, Long organizationId, Long urlId);

    ApiResponse<Page<UrlResponse>> getUrlsByOrganization(Long organizationId, String userEmail, Pageable pageable);

    ApiResponse<Page<UrlResponse>> getUserUrls(String userEmail, Pageable pageable);

    ApiResponse<UrlResponse> getUrlDetails(Long urlId, String userEmail);

//    ApiResponse<UrlAnalyticsResponse> getUrlAnalytics(Long urlId, String userEmail);

    ApiResponse<String> deleteUrl(Long urlId, String userEmail);

    ApiResponse<UrlResponse> updateUrl(Long urlId, CreateUrlRequest request, String userEmail);
}
