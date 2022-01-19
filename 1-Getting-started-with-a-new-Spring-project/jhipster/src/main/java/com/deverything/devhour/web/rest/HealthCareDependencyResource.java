package com.deverything.devhour.web.rest;

import com.deverything.devhour.repository.HealthCareDependencyRepository;
import com.deverything.devhour.service.HealthCareDependencyService;
import com.deverything.devhour.service.dto.HealthCareDependencyDTO;
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
 * REST controller for managing {@link com.deverything.devhour.domain.HealthCareDependency}.
 */
@RestController
@RequestMapping("/api")
public class HealthCareDependencyResource {

    private final Logger log = LoggerFactory.getLogger(HealthCareDependencyResource.class);

    private static final String ENTITY_NAME = "healthCareDependency";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HealthCareDependencyService healthCareDependencyService;

    private final HealthCareDependencyRepository healthCareDependencyRepository;

    public HealthCareDependencyResource(
        HealthCareDependencyService healthCareDependencyService,
        HealthCareDependencyRepository healthCareDependencyRepository
    ) {
        this.healthCareDependencyService = healthCareDependencyService;
        this.healthCareDependencyRepository = healthCareDependencyRepository;
    }

    /**
     * {@code POST  /health-care-dependencies} : Create a new healthCareDependency.
     *
     * @param healthCareDependencyDTO the healthCareDependencyDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new healthCareDependencyDTO, or with status {@code 400 (Bad Request)} if the healthCareDependency has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/health-care-dependencies")
    public ResponseEntity<HealthCareDependencyDTO> createHealthCareDependency(
        @Valid @RequestBody HealthCareDependencyDTO healthCareDependencyDTO
    ) throws URISyntaxException {
        log.debug("REST request to save HealthCareDependency : {}", healthCareDependencyDTO);
        if (healthCareDependencyDTO.getId() != null) {
            throw new BadRequestAlertException("A new healthCareDependency cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HealthCareDependencyDTO result = healthCareDependencyService.save(healthCareDependencyDTO);
        return ResponseEntity
            .created(new URI("/api/health-care-dependencies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /health-care-dependencies/:id} : Updates an existing healthCareDependency.
     *
     * @param id the id of the healthCareDependencyDTO to save.
     * @param healthCareDependencyDTO the healthCareDependencyDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated healthCareDependencyDTO,
     * or with status {@code 400 (Bad Request)} if the healthCareDependencyDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the healthCareDependencyDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/health-care-dependencies/{id}")
    public ResponseEntity<HealthCareDependencyDTO> updateHealthCareDependency(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody HealthCareDependencyDTO healthCareDependencyDTO
    ) throws URISyntaxException {
        log.debug("REST request to update HealthCareDependency : {}, {}", id, healthCareDependencyDTO);
        if (healthCareDependencyDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, healthCareDependencyDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!healthCareDependencyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HealthCareDependencyDTO result = healthCareDependencyService.save(healthCareDependencyDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, healthCareDependencyDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /health-care-dependencies/:id} : Partial updates given fields of an existing healthCareDependency, field will ignore if it is null
     *
     * @param id the id of the healthCareDependencyDTO to save.
     * @param healthCareDependencyDTO the healthCareDependencyDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated healthCareDependencyDTO,
     * or with status {@code 400 (Bad Request)} if the healthCareDependencyDTO is not valid,
     * or with status {@code 404 (Not Found)} if the healthCareDependencyDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the healthCareDependencyDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/health-care-dependencies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HealthCareDependencyDTO> partialUpdateHealthCareDependency(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody HealthCareDependencyDTO healthCareDependencyDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update HealthCareDependency partially : {}, {}", id, healthCareDependencyDTO);
        if (healthCareDependencyDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, healthCareDependencyDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!healthCareDependencyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HealthCareDependencyDTO> result = healthCareDependencyService.partialUpdate(healthCareDependencyDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, healthCareDependencyDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /health-care-dependencies} : get all the healthCareDependencies.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of healthCareDependencies in body.
     */
    @GetMapping("/health-care-dependencies")
    public ResponseEntity<List<HealthCareDependencyDTO>> getAllHealthCareDependencies(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of HealthCareDependencies");
        Page<HealthCareDependencyDTO> page = healthCareDependencyService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /health-care-dependencies/:id} : get the "id" healthCareDependency.
     *
     * @param id the id of the healthCareDependencyDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the healthCareDependencyDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/health-care-dependencies/{id}")
    public ResponseEntity<HealthCareDependencyDTO> getHealthCareDependency(@PathVariable Long id) {
        log.debug("REST request to get HealthCareDependency : {}", id);
        Optional<HealthCareDependencyDTO> healthCareDependencyDTO = healthCareDependencyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(healthCareDependencyDTO);
    }

    /**
     * {@code DELETE  /health-care-dependencies/:id} : delete the "id" healthCareDependency.
     *
     * @param id the id of the healthCareDependencyDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/health-care-dependencies/{id}")
    public ResponseEntity<Void> deleteHealthCareDependency(@PathVariable Long id) {
        log.debug("REST request to delete HealthCareDependency : {}", id);
        healthCareDependencyService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
