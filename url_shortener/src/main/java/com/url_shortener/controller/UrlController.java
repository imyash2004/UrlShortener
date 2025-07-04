package com.url_shortener.controller;

import com.url_shortener.dto.*;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.UrlResponse;
import com.url_shortener.service.UrlService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    @PostMapping
    public ResponseEntity<ApiResponse<UrlResponse>> createShortUrl(
            @Valid @RequestBody CreateUrlRequest request,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Authentication required"));
        }

        String userEmail = authentication.getName();
        ApiResponse<UrlResponse> response = urlService.createShortUrl(request, userEmail);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<ApiResponse<Page<UrlResponse>>> getUrlsByOrganization(
            @PathVariable Long organizationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Authentication required"));
        }

        String userEmail = authentication.getName();
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        ApiResponse<Page<UrlResponse>> response =
                urlService.getUrlsByOrganization(organizationId, userEmail, pageable);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/my-urls")
    public ResponseEntity<ApiResponse<Page<UrlResponse>>> getUserUrls(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Authentication required"));
        }

        String userEmail = authentication.getName();
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        ApiResponse<Page<UrlResponse>> response = urlService.getUserUrls(userEmail, pageable);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/{urlId}")
    public ResponseEntity<ApiResponse<UrlResponse>> getUrlDetails(
            @PathVariable Long urlId,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Authentication required"));
        }

        String userEmail = authentication.getName();
        ApiResponse<UrlResponse> response = urlService.getUrlDetails(urlId, userEmail);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/{urlId}")
    public ResponseEntity<ApiResponse<UrlResponse>> updateUrl(
            @PathVariable Long urlId,
            @Valid @RequestBody CreateUrlRequest request,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Authentication required"));
        }

        String userEmail = authentication.getName();
        ApiResponse<UrlResponse> response = urlService.updateUrl(urlId, request, userEmail);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }

    @DeleteMapping("/{urlId}")
    public ResponseEntity<ApiResponse<String>> deleteUrl(
            @PathVariable Long urlId,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Authentication required"));
        }

        String userEmail = authentication.getName();
        ApiResponse<String> response = urlService.deleteUrl(urlId, userEmail);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }
}
