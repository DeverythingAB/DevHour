package com.deverything.devhour.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.deverything.devhour.domain.Diagnosis} entity.
 */
public class DiagnosisDTO implements Serializable {

    private Long id;

    @NotNull
    private String diagnosis;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DiagnosisDTO)) {
            return false;
        }

        DiagnosisDTO diagnosisDTO = (DiagnosisDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, diagnosisDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DiagnosisDTO{" +
            "id=" + getId() +
            ", diagnosis='" + getDiagnosis() + "'" +
            "}";
    }
}
