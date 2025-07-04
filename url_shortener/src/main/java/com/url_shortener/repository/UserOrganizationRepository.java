package com.url_shortener.repository;

import com.url_shortener.entity.UserOrganization;
import com.url_shortener.entity.User;
import com.url_shortener.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserOrganizationRepository extends JpaRepository<UserOrganization, Long> {
    Optional<UserOrganization> findByUserAndOrganizationAndActiveTrue(User user, Organization organization);

    Page<UserOrganization> findByOrganizationAndActiveTrue(Organization organization, Pageable pageable);

    boolean existsByUserAndOrganizationAndActiveTrue(User user, Organization organization);
}