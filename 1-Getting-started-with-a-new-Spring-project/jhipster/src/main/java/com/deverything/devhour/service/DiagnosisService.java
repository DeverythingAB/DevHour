package com.deverything.devhour.service;

import com.deverything.devhour.service.dto.DiagnosisDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.deverything.devhour.domain.Diagnosis}.
 */
public interface DiagnosisService {
    /**
     * Save a diagnosis.
     *
     * @param diagnosisDTO the entity to save.
     * @return the persisted entity.
     */
    DiagnosisDTO save(DiagnosisDTO diagnosisDTO);

    /**
     * Partially updates a diagnosis.
     *
     * @param diagnosisDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DiagnosisDTO> partialUpdate(DiagnosisDTO diagnosisDTO);

    /**
     * Get all the diagnoses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DiagnosisDTO> findAll(Pageable pageable);

    /**
     * Get the "id" diagnosis.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DiagnosisDTO> findOne(Long id);

    /**
     * Delete the "id" diagnosis.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
