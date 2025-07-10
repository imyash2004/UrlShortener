package com.url_shortener.controller;

import com.url_shortener.dto.*;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.OrganizationResponse;
import com.url_shortener.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private static final Logger logger = LoggerFactory.getLogger(OrganizationController.class);
    private final OrganizationService organizationService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationResponse>> createOrganization(
            @Valid @RequestBody CreateOrganizationRequest request,
            Authentication authentication) {

        logger.info("Received organization creation request: {}", request);
        String userEmail = authentication.getName();
        logger.info("User email: {}", userEmail);
        
        ApiResponse<OrganizationResponse> response = organizationService.createOrganization(request, userEmail);
        logger.info("Organization creation response: {}", response);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrganizationResponse>>> getUserOrganizations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {

        String userEmail = authentication.getName();
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        ApiResponse<Page<OrganizationResponse>> response =
                organizationService.getUserOrganizations(userEmail, pageable);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/{organizationId}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganizationById(
            @PathVariable Long organizationId,
            Authentication authentication) {

        String userEmail = authentication.getName();
        ApiResponse<OrganizationResponse> response =
                organizationService.getOrganizationById(organizationId, userEmail);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/{organizationId}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> updateOrganization(
            @PathVariable Long organizationId,
            @Valid @RequestBody CreateOrganizationRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        ApiResponse<OrganizationResponse> response =
                organizationService.updateOrganization(organizationId, request, userEmail);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }

    @DeleteMapping("/{organizationId}")
    public ResponseEntity<ApiResponse<String>> deleteOrganization(
            @PathVariable Long organizationId,
            Authentication authentication) {

        String userEmail = authentication.getName();
        ApiResponse<String> response =
                organizationService.deleteOrganization(organizationId, userEmail);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        
        logger.error("Validation error: {}", errorMessage);
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(errorMessage));
    }
}