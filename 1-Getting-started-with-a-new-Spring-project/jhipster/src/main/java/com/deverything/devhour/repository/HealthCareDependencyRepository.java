package com.deverything.devhour.repository;

import com.deverything.devhour.domain.HealthCareDependency;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the HealthCareDependency entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HealthCareDependencyRepository extends JpaRepository<HealthCareDependency, Long> {}
