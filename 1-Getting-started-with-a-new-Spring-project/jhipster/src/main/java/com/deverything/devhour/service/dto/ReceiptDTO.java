package com.deverything.devhour.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.deverything.devhour.domain.Receipt} entity.
 */
public class ReceiptDTO implements Serializable {

    private Long id;

    @NotNull
    private Long number;

    private HealthCareDependencyDTO healthCareDependency;

    private DiagnosisDTO diagnosis;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNumber() {
        return number;
    }

    public void setNumber(Long number) {
        this.number = number;
    }

    public HealthCareDependencyDTO getHealthCareDependency() {
        return healthCareDependency;
    }

    public void setHealthCareDependency(HealthCareDependencyDTO healthCareDependency) {
        this.healthCareDependency = healthCareDependency;
    }

    public DiagnosisDTO getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(DiagnosisDTO diagnosis) {
        this.diagnosis = diagnosis;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReceiptDTO)) {
            return false;
        }

        ReceiptDTO receiptDTO = (ReceiptDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, receiptDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReceiptDTO{" +
            "id=" + getId() +
            ", number=" + getNumber() +
            ", healthCareDependency=" + getHealthCareDependency() +
            ", diagnosis=" + getDiagnosis() +
            "}";
    }
}
