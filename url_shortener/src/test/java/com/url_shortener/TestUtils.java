package com.url_shortener;

import com.url_shortener.dto.CreateOrganizationRequest;
import com.url_shortener.dto.CreateUrlRequest;
import com.url_shortener.dto.SignInRequest;
import com.url_shortener.dto.SignUpRequest;
import com.url_shortener.entity.Organization;
import com.url_shortener.entity.User;
import com.url_shortener.entity.Url;

import java.time.LocalDateTime;

public class TestUtils {

    public static User createTestUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("encodedPassword");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    public static Organization createTestOrganization() {
        Organization org = new Organization();
        org.setId(1L);
        org.setName("Test Organization");
        org.setDescription("Test Description");
        org.setShortName("testorg");
        org.setActive(true);
        org.setCreatedAt(LocalDateTime.now());
        org.setOwner(createTestUser());
        return org;
    }

    public static Url createTestUrl() {
        Url url = new Url();
        url.setId(1L);
        url.setOriginalUrl("https://example.com/very-long-url");
        url.setShortCode("abc123");
        url.setShortUrl("http://localhost:8080/s/abc123");
        url.setTitle("Test URL");
        url.setDescription("Test Description");
        url.setClickCount(0L);
        url.setCreatedAt(LocalDateTime.now());
        url.setActive(true);
        url.setCreatedBy(createTestUser());
        url.setOrganization(createTestOrganization());
        return url;
    }

    public static SignUpRequest createSignUpRequest() {
        SignUpRequest request = new SignUpRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setFirstName("John");
        request.setLastName("Doe");
        return request;
    }

    public static SignInRequest createSignInRequest() {
        SignInRequest request = new SignInRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        return request;
    }

    public static CreateOrganizationRequest createOrganizationRequest() {
        CreateOrganizationRequest request = new CreateOrganizationRequest();
        request.setName("Test Organization");
        request.setDescription("Test Description");
        return request;
    }

    public static CreateUrlRequest createUrlRequest() {
        CreateUrlRequest request = new CreateUrlRequest();
        request.setOriginalUrl("https://example.com/very-long-url");
        request.setTitle("Test URL");
        request.setDescription("Test Description");
        request.setOrganizationId(1L);
        return request;
    }
} 