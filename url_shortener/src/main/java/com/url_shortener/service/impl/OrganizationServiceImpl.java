package com.url_shortener.service.impl;

import com.url_shortener.dto.*;
import com.url_shortener.entity.*;
import com.url_shortener.repository.*;
import com.url_shortener.response.ApiResponse;
import com.url_shortener.response.OrganizationResponse;
import com.url_shortener.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final UserOrganizationRepository userOrganizationRepository;
    private final UrlRepository urlRepository;

    @Override
    public ApiResponse<OrganizationResponse> createOrganization(CreateOrganizationRequest request, String userEmail) {
        try {
            // Check if organization name already exists
            if (organizationRepository.existsByName(request.getName())) {
                return ApiResponse.error("Organization name already exists");
            }

            // Find user
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create organization
            Organization organization = new Organization();
            organization.setName(request.getName());
            organization.setDescription(request.getDescription());
            organization.setOwner(user);

            Organization savedOrg = organizationRepository.save(organization);

            // Add owner as member with OWNER role
            UserOrganization userOrg = new UserOrganization();
            userOrg.setUser(user);
            userOrg.setOrganization(savedOrg);
            userOrg.setRole(UserOrganization.Role.OWNER);
            userOrganizationRepository.save(userOrg);

            OrganizationResponse response = mapToResponse(savedOrg);
            return ApiResponse.success("Organization created successfully", response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to create organization: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<OrganizationResponse>> getUserOrganizations(String userEmail, Pageable pageable) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Page<Organization> organizations = organizationRepository.findUserOrganizations(user, pageable);
            Page<OrganizationResponse> response = organizations.map(this::mapToResponse);

            return ApiResponse.success(response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to fetch organizations: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<OrganizationResponse> getOrganizationById(Long organizationId, String userEmail) {
        try {
            if (!hasAccess(organizationId, userEmail)) {
                return ApiResponse.error("Access denied to this organization");
            }

            Organization organization = organizationRepository.findByIdAndActiveTrue(organizationId)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));

            OrganizationResponse response = mapToResponse(organization);
            return ApiResponse.success(response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to fetch organization: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<OrganizationResponse> updateOrganization(Long organizationId, CreateOrganizationRequest request, String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Organization organization = organizationRepository.findByIdAndActiveTrue(organizationId)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));

            // Check if user is owner
            if (!organization.getOwner().equals(user)) {
                return ApiResponse.error("Only organization owner can update organization");
            }

            // Check if new name already exists (excluding current organization)
            if (!organization.getName().equals(request.getName()) &&
                    organizationRepository.existsByName(request.getName())) {
                return ApiResponse.error("Organization name already exists");
            }

            organization.setName(request.getName());
            organization.setDescription(request.getDescription());

            Organization savedOrg = organizationRepository.save(organization);
            OrganizationResponse response = mapToResponse(savedOrg);

            return ApiResponse.success("Organization updated successfully", response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to update organization: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<String> deleteOrganization(Long organizationId, String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Organization organization = organizationRepository.findByIdAndActiveTrue(organizationId)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));

            // Check if user is owner
            if (!organization.getOwner().equals(user)) {
                return ApiResponse.error("Only organization owner can delete organization");
            }

            // Soft delete
            organization.setActive(false);
            organizationRepository.save(organization);

            return ApiResponse.success("Organization deleted successfully", null);

        } catch (Exception e) {
            return ApiResponse.error("Failed to delete organization: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Organization findOrganizationEntity(Long organizationId) {
        return organizationRepository.findByIdAndActiveTrue(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasAccess(Long organizationId, String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Organization organization = organizationRepository.findByIdAndActiveTrue(organizationId)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));

            // Check if user is owner or member
            return organization.getOwner().equals(user) ||
                    userOrganizationRepository.existsByUserAndOrganizationAndActiveTrue(user, organization);

        } catch (Exception e) {
            return false;
        }
    }

    private OrganizationResponse mapToResponse(Organization organization) {
        OrganizationResponse response = new OrganizationResponse();
        response.setId(organization.getId());
        response.setName(organization.getName());
        response.setDescription(organization.getDescription());
        response.setCreatedAt(organization.getCreatedAt());
        response.setActive(organization.isActive());
        response.setOwnerEmail(organization.getOwner().getEmail());
        response.setOwnerName(organization.getOwner().getFirstName() + " " + organization.getOwner().getLastName());

        // Count members and URLs
        response.setMemberCount((long) (organization.getMembers() != null ? organization.getMembers().size() : 0));
        response.setUrlCount(urlRepository.countByOrganizationAndActiveTrue(organization));

        return response;
    }
}
