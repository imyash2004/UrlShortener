package com.url_shortener.repository;

import com.url_shortener.entity.Organization;
import com.url_shortener.entity.Url;
import com.url_shortener.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UrlRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    private User testUser;
    private Organization testOrganization;
    private Url testUrl;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setPassword("encodedPassword");
        testUser.setActive(true);
        testUser.setCreatedAt(LocalDateTime.now());
        testUser = entityManager.persistAndFlush(testUser);

        // Create test organization
        testOrganization = new Organization();
        testOrganization.setName("Test Organization");
        testOrganization.setDescription("Test Description");
        testOrganization.setShortName("testorg");
        testOrganization.setOwner(testUser);
        testOrganization.setActive(true);
        testOrganization.setCreatedAt(LocalDateTime.now());
        testOrganization = entityManager.persistAndFlush(testOrganization);

        // Create test URL
        testUrl = new Url();
        testUrl.setOriginalUrl("https://example.com/very-long-url");
        testUrl.setShortCode("abc123");
        testUrl.setShortUrl("http://localhost:8080/s/abc123");
        testUrl.setTitle("Test URL");
        testUrl.setDescription("Test Description");
        testUrl.setClickCount(0L);
        testUrl.setCreatedAt(LocalDateTime.now());
        testUrl.setActive(true);
        testUrl.setCreatedBy(testUser);
        testUrl.setOrganization(testOrganization);
        testUrl.setOrganizationUrlId(1L);
    }

    @Test
    void saveUrl_Success() {
        // Act
        Url savedUrl = urlRepository.save(testUrl);

        // Assert
        assertNotNull(savedUrl.getId());
        assertEquals("https://example.com/very-long-url", savedUrl.getOriginalUrl());
        assertEquals("abc123", savedUrl.getShortCode());
        assertEquals("Test URL", savedUrl.getTitle());
        assertTrue(savedUrl.isActive());
        assertEquals(0L, savedUrl.getClickCount());
    }

    @Test
    void findByShortCodeAndActiveTrue_Success() {
        // Arrange
        entityManager.persistAndFlush(testUrl);

        // Act
        Optional<Url> foundUrl = urlRepository.findByShortCodeAndActiveTrue("abc123");

        // Assert
        assertTrue(foundUrl.isPresent());
        assertEquals("abc123", foundUrl.get().getShortCode());
        assertEquals("https://example.com/very-long-url", foundUrl.get().getOriginalUrl());
    }

    @Test
    void findByShortCodeAndActiveTrue_NotFound() {
        // Act
        Optional<Url> foundUrl = urlRepository.findByShortCodeAndActiveTrue("nonexistent");

        // Assert
        assertFalse(foundUrl.isPresent());
    }

    @Test
    void findByShortCodeAndActiveTrue_InactiveUrl() {
        // Arrange
        testUrl.setActive(false);
        entityManager.persistAndFlush(testUrl);

        // Act
        Optional<Url> foundUrl = urlRepository.findByShortCodeAndActiveTrue("abc123");

        // Assert
        assertFalse(foundUrl.isPresent());
    }

    @Test
    void findByCreatedByAndActiveTrue_Success() {
        // Arrange
        entityManager.persistAndFlush(testUrl);

        // Create another URL for the same user
        Url secondUrl = new Url();
        secondUrl.setOriginalUrl("https://example.com/another-url");
        secondUrl.setShortCode("def456");
        secondUrl.setShortUrl("http://localhost:8080/s/def456");
        secondUrl.setTitle("Another URL");
        secondUrl.setDescription("Another Description");
        secondUrl.setClickCount(5L);
        secondUrl.setCreatedAt(LocalDateTime.now());
        secondUrl.setActive(true);
        secondUrl.setCreatedBy(testUser);
        secondUrl.setOrganization(testOrganization);
        secondUrl.setOrganizationUrlId(2L);
        entityManager.persistAndFlush(secondUrl);

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Url> foundUrls = urlRepository.findByCreatedByAndActiveTrue(testUser, pageable);

        // Assert
        assertEquals(2, foundUrls.getContent().size());
        assertTrue(foundUrls.getContent().stream().anyMatch(url -> url.getShortCode().equals("abc123")));
        assertTrue(foundUrls.getContent().stream().anyMatch(url -> url.getShortCode().equals("def456")));
    }

    @Test
    void findByCreatedByAndActiveTrue_EmptyResult() {
        // Arrange
        User anotherUser = new User();
        anotherUser.setEmail("another@example.com");
        anotherUser.setFirstName("Jane");
        anotherUser.setLastName("Smith");
        anotherUser.setPassword("encodedPassword");
        anotherUser.setActive(true);
        anotherUser.setCreatedAt(LocalDateTime.now());
        entityManager.persistAndFlush(anotherUser);

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Url> foundUrls = urlRepository.findByCreatedByAndActiveTrue(anotherUser, pageable);

        // Assert
        assertEquals(0, foundUrls.getContent().size());
    }

    @Test
    void existsByShortCode_True() {
        // Arrange
        entityManager.persistAndFlush(testUrl);

        // Act
        boolean exists = urlRepository.existsByShortCode("abc123");

        // Assert
        assertTrue(exists);
    }

    @Test
    void existsByShortCode_False() {
        // Act
        boolean exists = urlRepository.existsByShortCode("nonexistent");

        // Assert
        assertFalse(exists);
    }

    @Test
    void findById_Success() {
        // Arrange
        Url savedUrl = entityManager.persistAndFlush(testUrl);

        // Act
        Optional<Url> foundUrl = urlRepository.findById(savedUrl.getId());

        // Assert
        assertTrue(foundUrl.isPresent());
        assertEquals(savedUrl.getId(), foundUrl.get().getId());
        assertEquals("abc123", foundUrl.get().getShortCode());
    }

    @Test
    void findById_NotFound() {
        // Act
        Optional<Url> foundUrl = urlRepository.findById(999L);

        // Assert
        assertFalse(foundUrl.isPresent());
    }

    @Test
    void deleteUrl_Success() {
        // Arrange
        Url savedUrl = entityManager.persistAndFlush(testUrl);

        // Act
        urlRepository.deleteById(savedUrl.getId());

        // Assert
        Optional<Url> foundUrl = urlRepository.findById(savedUrl.getId());
        assertFalse(foundUrl.isPresent());
    }

    @Test
    void updateUrl_Success() {
        // Arrange
        Url savedUrl = entityManager.persistAndFlush(testUrl);
        savedUrl.setTitle("Updated Title");
        savedUrl.setDescription("Updated Description");
        savedUrl.setClickCount(10L);

        // Act
        Url updatedUrl = urlRepository.save(savedUrl);

        // Assert
        assertEquals("Updated Title", updatedUrl.getTitle());
        assertEquals("Updated Description", updatedUrl.getDescription());
        assertEquals(10L, updatedUrl.getClickCount());
    }

    @Test
    void countByOrganizationAndActiveTrue_Success() {
        // Arrange
        entityManager.persistAndFlush(testUrl);

        // Create another URL for the same organization
        Url secondUrl = new Url();
        secondUrl.setOriginalUrl("https://example.com/another-url");
        secondUrl.setShortCode("def456");
        secondUrl.setShortUrl("http://localhost:8080/s/def456");
        secondUrl.setTitle("Another URL");
        secondUrl.setDescription("Another Description");
        secondUrl.setClickCount(5L);
        secondUrl.setCreatedAt(LocalDateTime.now());
        secondUrl.setActive(true);
        secondUrl.setCreatedBy(testUser);
        secondUrl.setOrganization(testOrganization);
        secondUrl.setOrganizationUrlId(3L);
        entityManager.persistAndFlush(secondUrl);

        // Create inactive URL
        Url inactiveUrl = new Url();
        inactiveUrl.setOriginalUrl("https://example.com/inactive-url");
        inactiveUrl.setShortCode("ghi789");
        inactiveUrl.setShortUrl("http://localhost:8080/s/ghi789");
        inactiveUrl.setTitle("Inactive URL");
        inactiveUrl.setDescription("Inactive Description");
        inactiveUrl.setClickCount(0L);
        inactiveUrl.setCreatedAt(LocalDateTime.now());
        inactiveUrl.setActive(false);
        inactiveUrl.setCreatedBy(testUser);
        inactiveUrl.setOrganization(testOrganization);
        inactiveUrl.setOrganizationUrlId(4L);
        entityManager.persistAndFlush(inactiveUrl);

        // Act
        long count = urlRepository.countByOrganizationAndActiveTrue(testOrganization);

        // Assert
        assertEquals(2, count);
    }
} 