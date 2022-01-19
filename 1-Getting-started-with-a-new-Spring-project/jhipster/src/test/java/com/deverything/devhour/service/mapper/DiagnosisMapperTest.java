package com.deverything.devhour.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DiagnosisMapperTest {

    private DiagnosisMapper diagnosisMapper;

    @BeforeEach
    public void setUp() {
        diagnosisMapper = new DiagnosisMapperImpl();
    }
}
