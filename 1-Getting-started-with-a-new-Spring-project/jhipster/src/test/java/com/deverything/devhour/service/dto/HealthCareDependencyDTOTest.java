package com.deverything.devhour.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.deverything.devhour.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HealthCareDependencyDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(HealthCareDependencyDTO.class);
        HealthCareDependencyDTO healthCareDependencyDTO1 = new HealthCareDependencyDTO();
        healthCareDependencyDTO1.setId(1L);
        HealthCareDependencyDTO healthCareDependencyDTO2 = new HealthCareDependencyDTO();
        assertThat(healthCareDependencyDTO1).isNotEqualTo(healthCareDependencyDTO2);
        healthCareDependencyDTO2.setId(healthCareDependencyDTO1.getId());
        assertThat(healthCareDependencyDTO1).isEqualTo(healthCareDependencyDTO2);
        healthCareDependencyDTO2.setId(2L);
        assertThat(healthCareDependencyDTO1).isNotEqualTo(healthCareDependencyDTO2);
        healthCareDependencyDTO1.setId(null);
        assertThat(healthCareDependencyDTO1).isNotEqualTo(healthCareDependencyDTO2);
    }
}
