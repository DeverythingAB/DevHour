package com.deverything.devhour.web.rest;

import com.deverything.devhour.repository.DiagnosisRepository;
import com.deverything.devhour.service.DiagnosisService;
import com.deverything.devhour.service.dto.DiagnosisDTO;
import com.deverything.devhour.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.deverything.devhour.domain.Diagnosis}.
 */
@RestController
@RequestMapping("/api")
public class DiagnosisResource {

    private final Logger log = LoggerFactory.getLogger(DiagnosisResource.class);

    private static final String ENTITY_NAME = "diagnosis";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DiagnosisService diagnosisService;

    private final DiagnosisRepository diagnosisRepository;

    public DiagnosisResource(DiagnosisService diagnosisService, DiagnosisRepository diagnosisRepository) {
        this.diagnosisService = diagnosisService;
        this.diagnosisRepository = diagnosisRepository;
    }

    /**
     * {@code POST  /diagnoses} : Create a new diagnosis.
     *
     * @param diagnosisDTO the diagnosisDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new diagnosisDTO, or with status {@code 400 (Bad Request)} if the diagnosis has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/diagnoses")
    public ResponseEntity<DiagnosisDTO> createDiagnosis(@Valid @RequestBody DiagnosisDTO diagnosisDTO) throws URISyntaxException {
        log.debug("REST request to save Diagnosis : {}", diagnosisDTO);
        if (diagnosisDTO.getId() != null) {
            throw new BadRequestAlertException("A new diagnosis cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DiagnosisDTO result = diagnosisService.save(diagnosisDTO);
        return ResponseEntity
            .created(new URI("/api/diagnoses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /diagnoses/:id} : Updates an existing diagnosis.
     *
     * @param id the id of the diagnosisDTO to save.
     * @param diagnosisDTO the diagnosisDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated diagnosisDTO,
     * or with status {@code 400 (Bad Request)} if the diagnosisDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the diagnosisDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/diagnoses/{id}")
    public ResponseEntity<DiagnosisDTO> updateDiagnosis(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DiagnosisDTO diagnosisDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Diagnosis : {}, {}", id, diagnosisDTO);
        if (diagnosisDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diagnosisDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!diagnosisRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DiagnosisDTO result = diagnosisService.save(diagnosisDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, diagnosisDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /diagnoses/:id} : Partial updates given fields of an existing diagnosis, field will ignore if it is null
     *
     * @param id the id of the diagnosisDTO to save.
     * @param diagnosisDTO the diagnosisDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated diagnosisDTO,
     * or with status {@code 400 (Bad Request)} if the diagnosisDTO is not valid,
     * or with status {@code 404 (Not Found)} if the diagnosisDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the diagnosisDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/diagnoses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DiagnosisDTO> partialUpdateDiagnosis(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DiagnosisDTO diagnosisDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Diagnosis partially : {}, {}", id, diagnosisDTO);
        if (diagnosisDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diagnosisDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!diagnosisRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DiagnosisDTO> result = diagnosisService.partialUpdate(diagnosisDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, diagnosisDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /diagnoses} : get all the diagnoses.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of diagnoses in body.
     */
    @GetMapping("/diagnoses")
    public ResponseEntity<List<DiagnosisDTO>> getAllDiagnoses(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Diagnoses");
        Page<DiagnosisDTO> page = diagnosisService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /diagnoses/:id} : get the "id" diagnosis.
     *
     * @param id the id of the diagnosisDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the diagnosisDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/diagnoses/{id}")
    public ResponseEntity<DiagnosisDTO> getDiagnosis(@PathVariable Long id) {
        log.debug("REST request to get Diagnosis : {}", id);
        Optional<DiagnosisDTO> diagnosisDTO = diagnosisService.findOne(id);
        return ResponseUtil.wrapOrNotFound(diagnosisDTO);
    }

    /**
     * {@code DELETE  /diagnoses/:id} : delete the "id" diagnosis.
     *
     * @param id the id of the diagnosisDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/diagnoses/{id}")
    public ResponseEntity<Void> deleteDiagnosis(@PathVariable Long id) {
        log.debug("REST request to delete Diagnosis : {}", id);
        diagnosisService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
