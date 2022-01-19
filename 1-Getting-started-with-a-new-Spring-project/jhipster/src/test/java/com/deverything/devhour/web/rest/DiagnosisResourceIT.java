package com.deverything.devhour.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.deverything.devhour.IntegrationTest;
import com.deverything.devhour.domain.Diagnosis;
import com.deverything.devhour.repository.DiagnosisRepository;
import com.deverything.devhour.service.dto.DiagnosisDTO;
import com.deverything.devhour.service.mapper.DiagnosisMapper;
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
 * Integration tests for the {@link DiagnosisResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DiagnosisResourceIT {

    private static final String DEFAULT_DIAGNOSIS = "AAAAAAAAAA";
    private static final String UPDATED_DIAGNOSIS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/diagnoses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DiagnosisRepository diagnosisRepository;

    @Autowired
    private DiagnosisMapper diagnosisMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDiagnosisMockMvc;

    private Diagnosis diagnosis;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Diagnosis createEntity(EntityManager em) {
        Diagnosis diagnosis = new Diagnosis().diagnosis(DEFAULT_DIAGNOSIS);
        return diagnosis;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Diagnosis createUpdatedEntity(EntityManager em) {
        Diagnosis diagnosis = new Diagnosis().diagnosis(UPDATED_DIAGNOSIS);
        return diagnosis;
    }

    @BeforeEach
    public void initTest() {
        diagnosis = createEntity(em);
    }

    @Test
    @Transactional
    void createDiagnosis() throws Exception {
        int databaseSizeBeforeCreate = diagnosisRepository.findAll().size();
        // Create the Diagnosis
        DiagnosisDTO diagnosisDTO = diagnosisMapper.toDto(diagnosis);
        restDiagnosisMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diagnosisDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeCreate + 1);
        Diagnosis testDiagnosis = diagnosisList.get(diagnosisList.size() - 1);
        assertThat(testDiagnosis.getDiagnosis()).isEqualTo(DEFAULT_DIAGNOSIS);
    }

    @Test
    @Transactional
    void createDiagnosisWithExistingId() throws Exception {
        // Create the Diagnosis with an existing ID
        diagnosis.setId(1L);
        DiagnosisDTO diagnosisDTO = diagnosisMapper.toDto(diagnosis);

        int databaseSizeBeforeCreate = diagnosisRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDiagnosisMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diagnosisDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDiagnosisIsRequired() throws Exception {
        int databaseSizeBeforeTest = diagnosisRepository.findAll().size();
        // set the field null
        diagnosis.setDiagnosis(null);

        // Create the Diagnosis, which fails.
        DiagnosisDTO diagnosisDTO = diagnosisMapper.toDto(diagnosis);

        restDiagnosisMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diagnosisDTO))
            )
            .andExpect(status().isBadRequest());

        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDiagnoses() throws Exception {
        // Initialize the database
        diagnosisRepository.saveAndFlush(diagnosis);

        // Get all the diagnosisList
        restDiagnosisMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(diagnosis.getId().intValue())))
            .andExpect(jsonPath("$.[*].diagnosis").value(hasItem(DEFAULT_DIAGNOSIS)));
    }

    @Test
    @Transactional
    void getDiagnosis() throws Exception {
        // Initialize the database
        diagnosisRepository.saveAndFlush(diagnosis);

        // Get the diagnosis
        restDiagnosisMockMvc
            .perform(get(ENTITY_API_URL_ID, diagnosis.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(diagnosis.getId().intValue()))
            .andExpect(jsonPath("$.diagnosis").value(DEFAULT_DIAGNOSIS));
    }

    @Test
    @Transactional
    void getNonExistingDiagnosis() throws Exception {
        // Get the diagnosis
        restDiagnosisMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDiagnosis() throws Exception {
        // Initialize the database
        diagnosisRepository.saveAndFlush(diagnosis);

        int databaseSizeBeforeUpdate = diagnosisRepository.findAll().size();

        // Update the diagnosis
        Diagnosis updatedDiagnosis = diagnosisRepository.findById(diagnosis.getId()).get();
        // Disconnect from session so that the updates on updatedDiagnosis are not directly saved in db
        em.detach(updatedDiagnosis);
        updatedDiagnosis.diagnosis(UPDATED_DIAGNOSIS);
        DiagnosisDTO diagnosisDTO = diagnosisMapper.toDto(updatedDiagnosis);

        restDiagnosisMockMvc
            .perform(
                put(ENTITY_API_URL_ID, diagnosisDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diagnosisDTO))
            )
            .andExpect(status().isOk());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeUpdate);
        Diagnosis testDiagnosis = diagnosisList.get(diagnosisList.size() - 1);
        assertThat(testDiagnosis.getDiagnosis()).isEqualTo(UPDATED_DIAGNOSIS);
    }

    @Test
    @Transactional
    void putNonExistingDiagnosis() throws Exception {
        int databaseSizeBeforeUpdate = diagnosisRepository.findAll().size();
        diagnosis.setId(count.incrementAndGet());

        // Create the Diagnosis
        DiagnosisDTO diagnosisDTO = diagnosisMapper.toDto(diagnosis);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiagnosisMockMvc
            .perform(
                put(ENTITY_API_URL_ID, diagnosisDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diagnosisDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDiagnosis() throws Exception {
        int databaseSizeBeforeUpdate = diagnosisRepository.findAll().size();
        diagnosis.setId(count.incrementAndGet());

        // Create the Diagnosis
        DiagnosisDTO diagnosisDTO = diagnosisMapper.toDto(diagnosis);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiagnosisMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diagnosisDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDiagnosis() throws Exception {
        int databaseSizeBeforeUpdate = diagnosisRepository.findAll().size();
        diagnosis.setId(count.incrementAndGet());

        // Create the Diagnosis
        DiagnosisDTO diagnosisDTO = diagnosisMapper.toDto(diagnosis);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiagnosisMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diagnosisDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDiagnosisWithPatch() throws Exception {
        // Initialize the database
        diagnosisRepository.saveAndFlush(diagnosis);

        int databaseSizeBeforeUpdate = diagnosisRepository.findAll().size();

        // Update the diagnosis using partial update
        Diagnosis partialUpdatedDiagnosis = new Diagnosis();
        partialUpdatedDiagnosis.setId(diagnosis.getId());

        partialUpdatedDiagnosis.diagnosis(UPDATED_DIAGNOSIS);

        restDiagnosisMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiagnosis.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDiagnosis))
            )
            .andExpect(status().isOk());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeUpdate);
        Diagnosis testDiagnosis = diagnosisList.get(diagnosisList.size() - 1);
        assertThat(testDiagnosis.getDiagnosis()).isEqualTo(UPDATED_DIAGNOSIS);
    }

    @Test
    @Transactional
    void fullUpdateDiagnosisWithPatch() throws Exception {
        // Initialize the database
        diagnosisRepository.saveAndFlush(diagnosis);

        int databaseSizeBeforeUpdate = diagnosisRepository.findAll().size();

        // Update the diagnosis using partial update
        Diagnosis partialUpdatedDiagnosis = new Diagnosis();
        partialUpdatedDiagnosis.setId(diagnosis.getId());

        partialUpdatedDiagnosis.diagnosis(UPDATED_DIAGNOSIS);

        restDiagnosisMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiagnosis.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDiagnosis))
            )
            .andExpect(status().isOk());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeUpdate);
        Diagnosis testDiagnosis = diagnosisList.get(diagnosisList.size() - 1);
        assertThat(testDiagnosis.getDiagnosis()).isEqualTo(UPDATED_DIAGNOSIS);
    }

    @Test
    @Transactional
    void patchNonExistingDiagnosis() throws Exception {
        int databaseSizeBeforeUpdate = diagnosisRepository.findAll().size();
        diagnosis.setId(count.incrementAndGet());

        // Create the Diagnosis
        DiagnosisDTO diagnosisDTO = diagnosisMapper.toDto(diagnosis);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiagnosisMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, diagnosisDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(diagnosisDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDiagnosis() throws Exception {
        int databaseSizeBeforeUpdate = diagnosisRepository.findAll().size();
        diagnosis.setId(count.incrementAndGet());

        // Create the Diagnosis
        DiagnosisDTO diagnosisDTO = diagnosisMapper.toDto(diagnosis);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiagnosisMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(diagnosisDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDiagnosis() throws Exception {
        int databaseSizeBeforeUpdate = diagnosisRepository.findAll().size();
        diagnosis.setId(count.incrementAndGet());

        // Create the Diagnosis
        DiagnosisDTO diagnosisDTO = diagnosisMapper.toDto(diagnosis);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiagnosisMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(diagnosisDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Diagnosis in the database
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDiagnosis() throws Exception {
        // Initialize the database
        diagnosisRepository.saveAndFlush(diagnosis);

        int databaseSizeBeforeDelete = diagnosisRepository.findAll().size();

        // Delete the diagnosis
        restDiagnosisMockMvc
            .perform(delete(ENTITY_API_URL_ID, diagnosis.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Diagnosis> diagnosisList = diagnosisRepository.findAll();
        assertThat(diagnosisList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
