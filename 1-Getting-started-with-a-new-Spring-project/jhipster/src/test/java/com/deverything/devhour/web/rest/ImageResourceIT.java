package com.deverything.devhour.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.deverything.devhour.IntegrationTest;
import com.deverything.devhour.domain.Image;
import com.deverything.devhour.repository.ImageRepository;
import com.deverything.devhour.service.dto.ImageDTO;
import com.deverything.devhour.service.mapper.ImageMapper;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ImageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ImageResourceIT {

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final Boolean DEFAULT_UPLOADED = false;
    private static final Boolean UPDATED_UPLOADED = true;

    private static final String ENTITY_API_URL = "/api/images";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ImageMapper imageMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restImageMockMvc;

    private Image image;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Image createEntity(EntityManager em) {
        Image image = new Image().image(DEFAULT_IMAGE).imageContentType(DEFAULT_IMAGE_CONTENT_TYPE).uploaded(DEFAULT_UPLOADED);
        return image;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Image createUpdatedEntity(EntityManager em) {
        Image image = new Image().image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE).uploaded(UPDATED_UPLOADED);
        return image;
    }

    @BeforeEach
    public void initTest() {
        image = createEntity(em);
    }

    @Test
    @Transactional
    void createImage() throws Exception {
        int databaseSizeBeforeCreate = imageRepository.findAll().size();
        // Create the Image
        ImageDTO imageDTO = imageMapper.toDto(image);
        restImageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imageDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeCreate + 1);
        Image testImage = imageList.get(imageList.size() - 1);
        assertThat(testImage.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testImage.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testImage.getUploaded()).isEqualTo(DEFAULT_UPLOADED);
    }

    @Test
    @Transactional
    void createImageWithExistingId() throws Exception {
        // Create the Image with an existing ID
        image.setId(1L);
        ImageDTO imageDTO = imageMapper.toDto(image);

        int databaseSizeBeforeCreate = imageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restImageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllImages() throws Exception {
        // Initialize the database
        imageRepository.saveAndFlush(image);

        // Get all the imageList
        restImageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(image.getId().intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].uploaded").value(hasItem(DEFAULT_UPLOADED.booleanValue())));
    }

    @Test
    @Transactional
    void getImage() throws Exception {
        // Initialize the database
        imageRepository.saveAndFlush(image);

        // Get the image
        restImageMockMvc
            .perform(get(ENTITY_API_URL_ID, image.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(image.getId().intValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.uploaded").value(DEFAULT_UPLOADED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingImage() throws Exception {
        // Get the image
        restImageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewImage() throws Exception {
        // Initialize the database
        imageRepository.saveAndFlush(image);

        int databaseSizeBeforeUpdate = imageRepository.findAll().size();

        // Update the image
        Image updatedImage = imageRepository.findById(image.getId()).get();
        // Disconnect from session so that the updates on updatedImage are not directly saved in db
        em.detach(updatedImage);
        updatedImage.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE).uploaded(UPDATED_UPLOADED);
        ImageDTO imageDTO = imageMapper.toDto(updatedImage);

        restImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, imageDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imageDTO))
            )
            .andExpect(status().isOk());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeUpdate);
        Image testImage = imageList.get(imageList.size() - 1);
        assertThat(testImage.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testImage.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testImage.getUploaded()).isEqualTo(UPDATED_UPLOADED);
    }

    @Test
    @Transactional
    void putNonExistingImage() throws Exception {
        int databaseSizeBeforeUpdate = imageRepository.findAll().size();
        image.setId(count.incrementAndGet());

        // Create the Image
        ImageDTO imageDTO = imageMapper.toDto(image);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, imageDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchImage() throws Exception {
        int databaseSizeBeforeUpdate = imageRepository.findAll().size();
        image.setId(count.incrementAndGet());

        // Create the Image
        ImageDTO imageDTO = imageMapper.toDto(image);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamImage() throws Exception {
        int databaseSizeBeforeUpdate = imageRepository.findAll().size();
        image.setId(count.incrementAndGet());

        // Create the Image
        ImageDTO imageDTO = imageMapper.toDto(image);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImageMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imageDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateImageWithPatch() throws Exception {
        // Initialize the database
        imageRepository.saveAndFlush(image);

        int databaseSizeBeforeUpdate = imageRepository.findAll().size();

        // Update the image using partial update
        Image partialUpdatedImage = new Image();
        partialUpdatedImage.setId(image.getId());

        partialUpdatedImage.uploaded(UPDATED_UPLOADED);

        restImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImage.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedImage))
            )
            .andExpect(status().isOk());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeUpdate);
        Image testImage = imageList.get(imageList.size() - 1);
        assertThat(testImage.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testImage.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testImage.getUploaded()).isEqualTo(UPDATED_UPLOADED);
    }

    @Test
    @Transactional
    void fullUpdateImageWithPatch() throws Exception {
        // Initialize the database
        imageRepository.saveAndFlush(image);

        int databaseSizeBeforeUpdate = imageRepository.findAll().size();

        // Update the image using partial update
        Image partialUpdatedImage = new Image();
        partialUpdatedImage.setId(image.getId());

        partialUpdatedImage.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE).uploaded(UPDATED_UPLOADED);

        restImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImage.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedImage))
            )
            .andExpect(status().isOk());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeUpdate);
        Image testImage = imageList.get(imageList.size() - 1);
        assertThat(testImage.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testImage.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testImage.getUploaded()).isEqualTo(UPDATED_UPLOADED);
    }

    @Test
    @Transactional
    void patchNonExistingImage() throws Exception {
        int databaseSizeBeforeUpdate = imageRepository.findAll().size();
        image.setId(count.incrementAndGet());

        // Create the Image
        ImageDTO imageDTO = imageMapper.toDto(image);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, imageDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(imageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchImage() throws Exception {
        int databaseSizeBeforeUpdate = imageRepository.findAll().size();
        image.setId(count.incrementAndGet());

        // Create the Image
        ImageDTO imageDTO = imageMapper.toDto(image);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(imageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamImage() throws Exception {
        int databaseSizeBeforeUpdate = imageRepository.findAll().size();
        image.setId(count.incrementAndGet());

        // Create the Image
        ImageDTO imageDTO = imageMapper.toDto(image);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImageMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(imageDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Image in the database
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteImage() throws Exception {
        // Initialize the database
        imageRepository.saveAndFlush(image);

        int databaseSizeBeforeDelete = imageRepository.findAll().size();

        // Delete the image
        restImageMockMvc
            .perform(delete(ENTITY_API_URL_ID, image.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Image> imageList = imageRepository.findAll();
        assertThat(imageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
