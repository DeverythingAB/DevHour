package com.deverything.devhour.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class HealthCareDependencyMapperTest {

    private HealthCareDependencyMapper healthCareDependencyMapper;

    @BeforeEach
    public void setUp() {
        healthCareDependencyMapper = new HealthCareDependencyMapperImpl();
    }
}
