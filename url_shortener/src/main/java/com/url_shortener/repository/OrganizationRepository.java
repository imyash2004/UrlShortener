package com.url_shortener.repository;

import com.url_shortener.entity.Organization;
import com.url_shortener.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    boolean existsByName(String name);
    boolean existsByShortName(String shortName);

    Optional<Organization> findByIdAndActiveTrue(Long id);
    Optional<Organization> findByShortNameAndActiveTrue(String shortName);

    @Query("SELECT o FROM Organization o WHERE o.owner = :user OR o.id IN " +
            "(SELECT uo.organization.id FROM UserOrganization uo WHERE uo.user = :user AND uo.active = true)")
    Page<Organization> findUserOrganizations(@Param("user") User user, Pageable pageable);

    @Query("SELECT o FROM Organization o WHERE o.owner = :user")
    List<Organization> findByOwner(@Param("user") User user);
}