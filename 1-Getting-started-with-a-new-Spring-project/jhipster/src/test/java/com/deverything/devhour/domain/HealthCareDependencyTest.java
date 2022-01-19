package com.deverything.devhour.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.deverything.devhour.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HealthCareDependencyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HealthCareDependency.class);
        HealthCareDependency healthCareDependency1 = new HealthCareDependency();
        healthCareDependency1.setId(1L);
        HealthCareDependency healthCareDependency2 = new HealthCareDependency();
        healthCareDependency2.setId(healthCareDependency1.getId());
        assertThat(healthCareDependency1).isEqualTo(healthCareDependency2);
        healthCareDependency2.setId(2L);
        assertThat(healthCareDependency1).isNotEqualTo(healthCareDependency2);
        healthCareDependency1.setId(null);
        assertThat(healthCareDependency1).isNotEqualTo(healthCareDependency2);
    }
}
