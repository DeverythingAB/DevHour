package com.deverything.devhour.service.impl;

import com.deverything.devhour.domain.HealthCareDependency;
import com.deverything.devhour.repository.HealthCareDependencyRepository;
import com.deverything.devhour.service.HealthCareDependencyService;
import com.deverything.devhour.service.dto.HealthCareDependencyDTO;
import com.deverything.devhour.service.mapper.HealthCareDependencyMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link HealthCareDependency}.
 */
@Service
@Transactional
public class HealthCareDependencyServiceImpl implements HealthCareDependencyService {

    private final Logger log = LoggerFactory.getLogger(HealthCareDependencyServiceImpl.class);

    private final HealthCareDependencyRepository healthCareDependencyRepository;

    private final HealthCareDependencyMapper healthCareDependencyMapper;

    public HealthCareDependencyServiceImpl(
        HealthCareDependencyRepository healthCareDependencyRepository,
        HealthCareDependencyMapper healthCareDependencyMapper
    ) {
        this.healthCareDependencyRepository = healthCareDependencyRepository;
        this.healthCareDependencyMapper = healthCareDependencyMapper;
    }

    @Override
    public HealthCareDependencyDTO save(HealthCareDependencyDTO healthCareDependencyDTO) {
        log.debug("Request to save HealthCareDependency : {}", healthCareDependencyDTO);
        HealthCareDependency healthCareDependency = healthCareDependencyMapper.toEntity(healthCareDependencyDTO);
        healthCareDependency = healthCareDependencyRepository.save(healthCareDependency);
        return healthCareDependencyMapper.toDto(healthCareDependency);
    }

    @Override
    public Optional<HealthCareDependencyDTO> partialUpdate(HealthCareDependencyDTO healthCareDependencyDTO) {
        log.debug("Request to partially update HealthCareDependency : {}", healthCareDependencyDTO);

        return healthCareDependencyRepository
            .findById(healthCareDependencyDTO.getId())
            .map(existingHealthCareDependency -> {
                healthCareDependencyMapper.partialUpdate(existingHealthCareDependency, healthCareDependencyDTO);

                return existingHealthCareDependency;
            })
            .map(healthCareDependencyRepository::save)
            .map(healthCareDependencyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HealthCareDependencyDTO> findAll(Pageable pageable) {
        log.debug("Request to get all HealthCareDependencies");
        return healthCareDependencyRepository.findAll(pageable).map(healthCareDependencyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HealthCareDependencyDTO> findOne(Long id) {
        log.debug("Request to get HealthCareDependency : {}", id);
        return healthCareDependencyRepository.findById(id).map(healthCareDependencyMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete HealthCareDependency : {}", id);
        healthCareDependencyRepository.deleteById(id);
    }
}
