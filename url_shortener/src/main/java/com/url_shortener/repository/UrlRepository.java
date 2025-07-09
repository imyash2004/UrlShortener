package com.url_shortener.repository;

import com.url_shortener.entity.Url;
import com.url_shortener.entity.Organization;
import com.url_shortener.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByShortCodeAndActiveTrue(String shortCode);

    Optional<Url> findByIdAndActiveTrue(Long id);

    boolean existsByShortCode(String shortCode);

    Page<Url> findByOrganizationAndActiveTrue(Organization organization, Pageable pageable);

    Page<Url> findByCreatedByAndActiveTrue(User user, Pageable pageable);

    @Query("SELECT u FROM Url u WHERE u.organization = :org AND u.createdBy = :user AND u.active = true")
    Page<Url> findByOrganizationAndCreatedByAndActiveTrue(
            @Param("org") Organization organization,
            @Param("user") User user,
            Pageable pageable
    );

    Long countByOrganizationAndActiveTrue(Organization organization);

    // New method to find URL by organization and organization-specific ID
    @Query("SELECT u FROM Url u WHERE u.organization = :org AND u.active = true ORDER BY u.createdAt ASC")
    Page<Url> findByOrganizationAndActiveTrueOrderByCreatedAt(@Param("org") Organization organization, Pageable pageable);

    @Query("SELECT COUNT(u) FROM Url u WHERE u.organization.id = :organizationId")
    Long countByOrganizationId(@Param("organizationId") Long organizationId);

    // Find URL by exact short URL match
    Optional<Url> findByShortUrlAndActiveTrue(String shortUrl);

    @Query("SELECT u FROM Url u WHERE u.shortCode = :shortCode AND u.organization.id = :organizationId AND u.organizationUrlId = :organizationUrlId AND u.active = true")
    Optional<Url> findByShortCodeAndOrganizationIdAndOrganizationUrlIdAndActiveTrue(@Param("shortCode") String shortCode, @Param("organizationId") Long organizationId, @Param("organizationUrlId") Long organizationUrlId);

    @Query("SELECT u FROM Url u WHERE u.organization.id = :organizationId AND u.organizationUrlId = :organizationUrlId AND u.active = true")
    Optional<Url> findByOrganizationIdAndOrganizationUrlIdAndActiveTrue(@Param("organizationId") Long organizationId, @Param("organizationUrlId") Long organizationUrlId);

//    @Query("SELECT COUNT(uc) FROM UrlClick uc WHERE uc.url.id = :urlId AND uc.clickedAt >= :fromDate")
//    Long countClicksByUrlAndDateAfter(@Param("urlId") Long urlId, @Param("fromDate") LocalDateTime fromDate);
//}
}