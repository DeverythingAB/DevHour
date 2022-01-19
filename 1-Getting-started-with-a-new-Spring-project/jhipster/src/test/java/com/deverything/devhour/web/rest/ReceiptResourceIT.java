package com.deverything.devhour.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.deverything.devhour.IntegrationTest;
import com.deverything.devhour.domain.Receipt;
import com.deverything.devhour.repository.ReceiptRepository;
import com.deverything.devhour.service.dto.ReceiptDTO;
import com.deverything.devhour.service.mapper.ReceiptMapper;
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
 * Integration tests for the {@link ReceiptResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReceiptResourceIT {

    private static final Long DEFAULT_NUMBER = 1L;
    private static final Long UPDATED_NUMBER = 2L;

    private static final String ENTITY_API_URL = "/api/receipts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private ReceiptMapper receiptMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReceiptMockMvc;

    private Receipt receipt;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Receipt createEntity(EntityManager em) {
        Receipt receipt = new Receipt().number(DEFAULT_NUMBER);
        return receipt;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Receipt createUpdatedEntity(EntityManager em) {
        Receipt receipt = new Receipt().number(UPDATED_NUMBER);
        return receipt;
    }

    @BeforeEach
    public void initTest() {
        receipt = createEntity(em);
    }

    @Test
    @Transactional
    void createReceipt() throws Exception {
        int databaseSizeBeforeCreate = receiptRepository.findAll().size();
        // Create the Receipt
        ReceiptDTO receiptDTO = receiptMapper.toDto(receipt);
        restReceiptMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(receiptDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeCreate + 1);
        Receipt testReceipt = receiptList.get(receiptList.size() - 1);
        assertThat(testReceipt.getNumber()).isEqualTo(DEFAULT_NUMBER);
    }

    @Test
    @Transactional
    void createReceiptWithExistingId() throws Exception {
        // Create the Receipt with an existing ID
        receipt.setId(1L);
        ReceiptDTO receiptDTO = receiptMapper.toDto(receipt);

        int databaseSizeBeforeCreate = receiptRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReceiptMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(receiptDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = receiptRepository.findAll().size();
        // set the field null
        receipt.setNumber(null);

        // Create the Receipt, which fails.
        ReceiptDTO receiptDTO = receiptMapper.toDto(receipt);

        restReceiptMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(receiptDTO))
            )
            .andExpect(status().isBadRequest());

        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllReceipts() throws Exception {
        // Initialize the database
        receiptRepository.saveAndFlush(receipt);

        // Get all the receiptList
        restReceiptMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(receipt.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER.intValue())));
    }

    @Test
    @Transactional
    void getReceipt() throws Exception {
        // Initialize the database
        receiptRepository.saveAndFlush(receipt);

        // Get the receipt
        restReceiptMockMvc
            .perform(get(ENTITY_API_URL_ID, receipt.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(receipt.getId().intValue()))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingReceipt() throws Exception {
        // Get the receipt
        restReceiptMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewReceipt() throws Exception {
        // Initialize the database
        receiptRepository.saveAndFlush(receipt);

        int databaseSizeBeforeUpdate = receiptRepository.findAll().size();

        // Update the receipt
        Receipt updatedReceipt = receiptRepository.findById(receipt.getId()).get();
        // Disconnect from session so that the updates on updatedReceipt are not directly saved in db
        em.detach(updatedReceipt);
        updatedReceipt.number(UPDATED_NUMBER);
        ReceiptDTO receiptDTO = receiptMapper.toDto(updatedReceipt);

        restReceiptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, receiptDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(receiptDTO))
            )
            .andExpect(status().isOk());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
        Receipt testReceipt = receiptList.get(receiptList.size() - 1);
        assertThat(testReceipt.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().size();
        receipt.setId(count.incrementAndGet());

        // Create the Receipt
        ReceiptDTO receiptDTO = receiptMapper.toDto(receipt);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReceiptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, receiptDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(receiptDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().size();
        receipt.setId(count.incrementAndGet());

        // Create the Receipt
        ReceiptDTO receiptDTO = receiptMapper.toDto(receipt);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReceiptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(receiptDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().size();
        receipt.setId(count.incrementAndGet());

        // Create the Receipt
        ReceiptDTO receiptDTO = receiptMapper.toDto(receipt);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReceiptMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(receiptDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReceiptWithPatch() throws Exception {
        // Initialize the database
        receiptRepository.saveAndFlush(receipt);

        int databaseSizeBeforeUpdate = receiptRepository.findAll().size();

        // Update the receipt using partial update
        Receipt partialUpdatedReceipt = new Receipt();
        partialUpdatedReceipt.setId(receipt.getId());

        partialUpdatedReceipt.number(UPDATED_NUMBER);

        restReceiptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReceipt.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReceipt))
            )
            .andExpect(status().isOk());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
        Receipt testReceipt = receiptList.get(receiptList.size() - 1);
        assertThat(testReceipt.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateReceiptWithPatch() throws Exception {
        // Initialize the database
        receiptRepository.saveAndFlush(receipt);

        int databaseSizeBeforeUpdate = receiptRepository.findAll().size();

        // Update the receipt using partial update
        Receipt partialUpdatedReceipt = new Receipt();
        partialUpdatedReceipt.setId(receipt.getId());

        partialUpdatedReceipt.number(UPDATED_NUMBER);

        restReceiptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReceipt.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReceipt))
            )
            .andExpect(status().isOk());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
        Receipt testReceipt = receiptList.get(receiptList.size() - 1);
        assertThat(testReceipt.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().size();
        receipt.setId(count.incrementAndGet());

        // Create the Receipt
        ReceiptDTO receiptDTO = receiptMapper.toDto(receipt);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReceiptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, receiptDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(receiptDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().size();
        receipt.setId(count.incrementAndGet());

        // Create the Receipt
        ReceiptDTO receiptDTO = receiptMapper.toDto(receipt);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReceiptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(receiptDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().size();
        receipt.setId(count.incrementAndGet());

        // Create the Receipt
        ReceiptDTO receiptDTO = receiptMapper.toDto(receipt);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReceiptMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(receiptDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReceipt() throws Exception {
        // Initialize the database
        receiptRepository.saveAndFlush(receipt);

        int databaseSizeBeforeDelete = receiptRepository.findAll().size();

        // Delete the receipt
        restReceiptMockMvc
            .perform(delete(ENTITY_API_URL_ID, receipt.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Receipt> receiptList = receiptRepository.findAll();
        assertThat(receiptList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
