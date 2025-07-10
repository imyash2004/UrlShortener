package com.url_shortener.repository;

import com.url_shortener.entity.Organization;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class OrganizationRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private Organization testOrganization;

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
    }

    @Test
    void saveOrganization_Success() {
        // Act
        Organization savedOrg = organizationRepository.save(testOrganization);

        // Assert
        assertNotNull(savedOrg.getId());
        assertEquals("Test Organization", savedOrg.getName());
        assertEquals("Test Description", savedOrg.getDescription());
        assertEquals(testUser, savedOrg.getOwner());
        assertTrue(savedOrg.isActive());
    }

    @Test
    void findByIdAndActiveTrue_Success() {
        // Arrange
        entityManager.persistAndFlush(testOrganization);

        // Act
        Optional<Organization> foundOrg = organizationRepository.findByIdAndActiveTrue(testOrganization.getId());

        // Assert
        assertTrue(foundOrg.isPresent());
        assertEquals("Test Organization", foundOrg.get().getName());
        assertEquals(testUser, foundOrg.get().getOwner());
    }

    @Test
    void findByIdAndActiveTrue_NotFound() {
        // Act
        Optional<Organization> foundOrg = organizationRepository.findByIdAndActiveTrue(999L);

        // Assert
        assertFalse(foundOrg.isPresent());
    }

    @Test
    void findByIdAndActiveTrue_InactiveOrganization() {
        // Arrange
        testOrganization.setActive(false);
        entityManager.persistAndFlush(testOrganization);

        // Act
        Optional<Organization> foundOrg = organizationRepository.findByIdAndActiveTrue(testOrganization.getId());

        // Assert
        assertFalse(foundOrg.isPresent());
    }

    @Test
    void existsByName_True() {
        // Arrange
        entityManager.persistAndFlush(testOrganization);

        // Act
        boolean exists = organizationRepository.existsByName("Test Organization");

        // Assert
        assertTrue(exists);
    }

    @Test
    void existsByName_False() {
        // Act
        boolean exists = organizationRepository.existsByName("Nonexistent Organization");

        // Assert
        assertFalse(exists);
    }

    @Test
    void findByOwner_Success() {
        // Arrange
        entityManager.persistAndFlush(testOrganization);

        // Create another organization for the same owner
        Organization secondOrg = new Organization();
        secondOrg.setName("Second Organization");
        secondOrg.setDescription("Second Description");
        secondOrg.setShortName("secondorg2");
        secondOrg.setOwner(testUser);
        secondOrg.setActive(true);
        secondOrg.setCreatedAt(LocalDateTime.now());
        entityManager.persistAndFlush(secondOrg);

        // Act
        List<Organization> foundOrgs = organizationRepository.findByOwner(testUser);

        // Assert
        assertEquals(2, foundOrgs.size());
        assertTrue(foundOrgs.stream().anyMatch(org -> org.getName().equals("Test Organization")));
        assertTrue(foundOrgs.stream().anyMatch(org -> org.getName().equals("Second Organization")));
    }

    @Test
    void findByOwner_EmptyResult() {
        // Arrange
        User anotherUser = new User();
        anotherUser.setEmail("another@example.com");
        anotherUser.setFirstName("Jane");
        anotherUser.setLastName("Smith");
        anotherUser.setPassword("encodedPassword");
        anotherUser.setActive(true);
        anotherUser.setCreatedAt(LocalDateTime.now());
        entityManager.persistAndFlush(anotherUser);

        // Act
        List<Organization> foundOrgs = organizationRepository.findByOwner(anotherUser);

        // Assert
        assertEquals(0, foundOrgs.size());
    }

    @Test
    void findUserOrganizations_Success() {
        // Arrange
        entityManager.persistAndFlush(testOrganization);

        // Create another user and organization
        User anotherUser = new User();
        anotherUser.setEmail("another@example.com");
        anotherUser.setFirstName("Jane");
        anotherUser.setLastName("Smith");
        anotherUser.setPassword("encodedPassword");
        anotherUser.setActive(true);
        anotherUser.setCreatedAt(LocalDateTime.now());
        entityManager.persistAndFlush(anotherUser);

        Organization anotherOrg = new Organization();
        anotherOrg.setName("Another Organization");
        anotherOrg.setDescription("Another Description");
        anotherOrg.setShortName("anotherorg");
        anotherOrg.setOwner(anotherUser);
        anotherOrg.setActive(true);
        anotherOrg.setCreatedAt(LocalDateTime.now());
        entityManager.persistAndFlush(anotherOrg);

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Organization> foundOrgs = organizationRepository.findUserOrganizations(testUser, pageable);

        // Assert
        assertEquals(1, foundOrgs.getContent().size());
        assertEquals("Test Organization", foundOrgs.getContent().get(0).getName());
    }

    @Test
    void findUserOrganizations_EmptyResult() {
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
        Page<Organization> foundOrgs = organizationRepository.findUserOrganizations(anotherUser, pageable);

        // Assert
        assertEquals(0, foundOrgs.getContent().size());
    }

    @Test
    void findById_Success() {
        // Arrange
        Organization savedOrg = entityManager.persistAndFlush(testOrganization);

        // Act
        Optional<Organization> foundOrg = organizationRepository.findById(savedOrg.getId());

        // Assert
        assertTrue(foundOrg.isPresent());
        assertEquals(savedOrg.getId(), foundOrg.get().getId());
        assertEquals("Test Organization", foundOrg.get().getName());
    }

    @Test
    void findById_NotFound() {
        // Act
        Optional<Organization> foundOrg = organizationRepository.findById(999L);

        // Assert
        assertFalse(foundOrg.isPresent());
    }

    @Test
    void deleteOrganization_Success() {
        // Arrange
        Organization savedOrg = entityManager.persistAndFlush(testOrganization);

        // Act
        organizationRepository.deleteById(savedOrg.getId());

        // Assert
        Optional<Organization> foundOrg = organizationRepository.findById(savedOrg.getId());
        assertFalse(foundOrg.isPresent());
    }

    @Test
    void updateOrganization_Success() {
        // Arrange
        Organization savedOrg = entityManager.persistAndFlush(testOrganization);
        savedOrg.setName("Updated Organization");
        savedOrg.setDescription("Updated Description");

        // Act
        Organization updatedOrg = organizationRepository.save(savedOrg);

        // Assert
        assertEquals("Updated Organization", updatedOrg.getName());
        assertEquals("Updated Description", updatedOrg.getDescription());
        assertEquals(testUser, updatedOrg.getOwner());
    }
} 