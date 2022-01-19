package com.deverything.devhour.service;

import com.deverything.devhour.service.dto.HealthCareDependencyDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.deverything.devhour.domain.HealthCareDependency}.
 */
public interface HealthCareDependencyService {
    /**
     * Save a healthCareDependency.
     *
     * @param healthCareDependencyDTO the entity to save.
     * @return the persisted entity.
     */
    HealthCareDependencyDTO save(HealthCareDependencyDTO healthCareDependencyDTO);

    /**
     * Partially updates a healthCareDependency.
     *
     * @param healthCareDependencyDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<HealthCareDependencyDTO> partialUpdate(HealthCareDependencyDTO healthCareDependencyDTO);

    /**
     * Get all the healthCareDependencies.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<HealthCareDependencyDTO> findAll(Pageable pageable);

    /**
     * Get the "id" healthCareDependency.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<HealthCareDependencyDTO> findOne(Long id);

    /**
     * Delete the "id" healthCareDependency.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
