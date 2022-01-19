package com.deverything.devhour.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.deverything.devhour.IntegrationTest;
import com.deverything.devhour.domain.HealthCareDependency;
import com.deverything.devhour.repository.HealthCareDependencyRepository;
import com.deverything.devhour.service.dto.HealthCareDependencyDTO;
import com.deverything.devhour.service.mapper.HealthCareDependencyMapper;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link HealthCareDependencyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HealthCareDependencyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/health-care-dependencies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HealthCareDependencyRepository healthCareDependencyRepository;

    @Autowired
    private HealthCareDependencyMapper healthCareDependencyMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHealthCareDependencyMockMvc;

    private HealthCareDependency healthCareDependency;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HealthCareDependency createEntity(EntityManager em) {
        HealthCareDependency healthCareDependency = new HealthCareDependency().name(DEFAULT_NAME);
        return healthCareDependency;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HealthCareDependency createUpdatedEntity(EntityManager em) {
        HealthCareDependency healthCareDependency = new HealthCareDependency().name(UPDATED_NAME);
        return healthCareDependency;
    }

    @BeforeEach
    public void initTest() {
        healthCareDependency = createEntity(em);
    }

    @Test
    @Transactional
    void createHealthCareDependency() throws Exception {
        int databaseSizeBeforeCreate = healthCareDependencyRepository.findAll().size();
        // Create the HealthCareDependency
        HealthCareDependencyDTO healthCareDependencyDTO = healthCareDependencyMapper.toDto(healthCareDependency);
        restHealthCareDependencyMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(healthCareDependencyDTO))
            )
            .andExpect(status().isCreated());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeCreate + 1);
        HealthCareDependency testHealthCareDependency = healthCareDependencyList.get(healthCareDependencyList.size() - 1);
        assertThat(testHealthCareDependency.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createHealthCareDependencyWithExistingId() throws Exception {
        // Create the HealthCareDependency with an existing ID
        healthCareDependency.setId(1L);
        HealthCareDependencyDTO healthCareDependencyDTO = healthCareDependencyMapper.toDto(healthCareDependency);

        int databaseSizeBeforeCreate = healthCareDependencyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHealthCareDependencyMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(healthCareDependencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = healthCareDependencyRepository.findAll().size();
        // set the field null
        healthCareDependency.setName(null);

        // Create the HealthCareDependency, which fails.
        HealthCareDependencyDTO healthCareDependencyDTO = healthCareDependencyMapper.toDto(healthCareDependency);

        restHealthCareDependencyMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(healthCareDependencyDTO))
            )
            .andExpect(status().isBadRequest());

        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllHealthCareDependencies() throws Exception {
        // Initialize the database
        healthCareDependencyRepository.saveAndFlush(healthCareDependency);

        // Get all the healthCareDependencyList
        restHealthCareDependencyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(healthCareDependency.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getHealthCareDependency() throws Exception {
        // Initialize the database
        healthCareDependencyRepository.saveAndFlush(healthCareDependency);

        // Get the healthCareDependency
        restHealthCareDependencyMockMvc
            .perform(get(ENTITY_API_URL_ID, healthCareDependency.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(healthCareDependency.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingHealthCareDependency() throws Exception {
        // Get the healthCareDependency
        restHealthCareDependencyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewHealthCareDependency() throws Exception {
        // Initialize the database
        healthCareDependencyRepository.saveAndFlush(healthCareDependency);

        int databaseSizeBeforeUpdate = healthCareDependencyRepository.findAll().size();

        // Update the healthCareDependency
        HealthCareDependency updatedHealthCareDependency = healthCareDependencyRepository.findById(healthCareDependency.getId()).get();
        // Disconnect from session so that the updates on updatedHealthCareDependency are not directly saved in db
        em.detach(updatedHealthCareDependency);
        updatedHealthCareDependency.name(UPDATED_NAME);
        HealthCareDependencyDTO healthCareDependencyDTO = healthCareDependencyMapper.toDto(updatedHealthCareDependency);

        restHealthCareDependencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, healthCareDependencyDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(healthCareDependencyDTO))
            )
            .andExpect(status().isOk());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeUpdate);
        HealthCareDependency testHealthCareDependency = healthCareDependencyList.get(healthCareDependencyList.size() - 1);
        assertThat(testHealthCareDependency.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingHealthCareDependency() throws Exception {
        int databaseSizeBeforeUpdate = healthCareDependencyRepository.findAll().size();
        healthCareDependency.setId(count.incrementAndGet());

        // Create the HealthCareDependency
        HealthCareDependencyDTO healthCareDependencyDTO = healthCareDependencyMapper.toDto(healthCareDependency);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHealthCareDependencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, healthCareDependencyDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(healthCareDependencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHealthCareDependency() throws Exception {
        int databaseSizeBeforeUpdate = healthCareDependencyRepository.findAll().size();
        healthCareDependency.setId(count.incrementAndGet());

        // Create the HealthCareDependency
        HealthCareDependencyDTO healthCareDependencyDTO = healthCareDependencyMapper.toDto(healthCareDependency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHealthCareDependencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(healthCareDependencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHealthCareDependency() throws Exception {
        int databaseSizeBeforeUpdate = healthCareDependencyRepository.findAll().size();
        healthCareDependency.setId(count.incrementAndGet());

        // Create the HealthCareDependency
        HealthCareDependencyDTO healthCareDependencyDTO = healthCareDependencyMapper.toDto(healthCareDependency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHealthCareDependencyMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(healthCareDependencyDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHealthCareDependencyWithPatch() throws Exception {
        // Initialize the database
        healthCareDependencyRepository.saveAndFlush(healthCareDependency);

        int databaseSizeBeforeUpdate = healthCareDependencyRepository.findAll().size();

        // Update the healthCareDependency using partial update
        HealthCareDependency partialUpdatedHealthCareDependency = new HealthCareDependency();
        partialUpdatedHealthCareDependency.setId(healthCareDependency.getId());

        partialUpdatedHealthCareDependency.name(UPDATED_NAME);

        restHealthCareDependencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHealthCareDependency.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHealthCareDependency))
            )
            .andExpect(status().isOk());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeUpdate);
        HealthCareDependency testHealthCareDependency = healthCareDependencyList.get(healthCareDependencyList.size() - 1);
        assertThat(testHealthCareDependency.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateHealthCareDependencyWithPatch() throws Exception {
        // Initialize the database
        healthCareDependencyRepository.saveAndFlush(healthCareDependency);

        int databaseSizeBeforeUpdate = healthCareDependencyRepository.findAll().size();

        // Update the healthCareDependency using partial update
        HealthCareDependency partialUpdatedHealthCareDependency = new HealthCareDependency();
        partialUpdatedHealthCareDependency.setId(healthCareDependency.getId());

        partialUpdatedHealthCareDependency.name(UPDATED_NAME);

        restHealthCareDependencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHealthCareDependency.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHealthCareDependency))
            )
            .andExpect(status().isOk());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeUpdate);
        HealthCareDependency testHealthCareDependency = healthCareDependencyList.get(healthCareDependencyList.size() - 1);
        assertThat(testHealthCareDependency.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingHealthCareDependency() throws Exception {
        int databaseSizeBeforeUpdate = healthCareDependencyRepository.findAll().size();
        healthCareDependency.setId(count.incrementAndGet());

        // Create the HealthCareDependency
        HealthCareDependencyDTO healthCareDependencyDTO = healthCareDependencyMapper.toDto(healthCareDependency);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHealthCareDependencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, healthCareDependencyDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(healthCareDependencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHealthCareDependency() throws Exception {
        int databaseSizeBeforeUpdate = healthCareDependencyRepository.findAll().size();
        healthCareDependency.setId(count.incrementAndGet());

        // Create the HealthCareDependency
        HealthCareDependencyDTO healthCareDependencyDTO = healthCareDependencyMapper.toDto(healthCareDependency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHealthCareDependencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(healthCareDependencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHealthCareDependency() throws Exception {
        int databaseSizeBeforeUpdate = healthCareDependencyRepository.findAll().size();
        healthCareDependency.setId(count.incrementAndGet());

        // Create the HealthCareDependency
        HealthCareDependencyDTO healthCareDependencyDTO = healthCareDependencyMapper.toDto(healthCareDependency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHealthCareDependencyMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(healthCareDependencyDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HealthCareDependency in the database
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHealthCareDependency() throws Exception {
        // Initialize the database
        healthCareDependencyRepository.saveAndFlush(healthCareDependency);

        int databaseSizeBeforeDelete = healthCareDependencyRepository.findAll().size();

        // Delete the healthCareDependency
        restHealthCareDependencyMockMvc
            .perform(delete(ENTITY_API_URL_ID, healthCareDependency.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HealthCareDependency> healthCareDependencyList = healthCareDependencyRepository.findAll();
        assertThat(healthCareDependencyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
