package com.url_shortener.service;

import com.url_shortener.dto.*;
import com.url_shortener.entity.Organization;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.OrganizationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrganizationService {
    ApiResponse<OrganizationResponse> createOrganization(CreateOrganizationRequest request, String userEmail);

    ApiResponse<Page<OrganizationResponse>> getUserOrganizations(String userEmail, Pageable pageable);

    ApiResponse<OrganizationResponse> getOrganizationById(Long organizationId, String userEmail);

    ApiResponse<OrganizationResponse> updateOrganization(Long organizationId, CreateOrganizationRequest request, String userEmail);

    ApiResponse<String> deleteOrganization(Long organizationId, String userEmail);

    Organization findOrganizationEntity(Long organizationId);

    boolean hasAccess(Long organizationId, String userEmail);
}
