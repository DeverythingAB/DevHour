package com.deverything.devhour.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Receipt.
 */
@Entity
@Table(name = "receipt")
public class Receipt implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "number", nullable = false)
    private Long number;

    @JsonIgnoreProperties(value = { "location" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private HealthCareDependency healthCareDependency;

    @OneToOne
    @JoinColumn(unique = true)
    private Diagnosis diagnosis;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Receipt id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNumber() {
        return this.number;
    }

    public Receipt number(Long number) {
        this.setNumber(number);
        return this;
    }

    public void setNumber(Long number) {
        this.number = number;
    }

    public HealthCareDependency getHealthCareDependency() {
        return this.healthCareDependency;
    }

    public void setHealthCareDependency(HealthCareDependency healthCareDependency) {
        this.healthCareDependency = healthCareDependency;
    }

    public Receipt healthCareDependency(HealthCareDependency healthCareDependency) {
        this.setHealthCareDependency(healthCareDependency);
        return this;
    }

    public Diagnosis getDiagnosis() {
        return this.diagnosis;
    }

    public void setDiagnosis(Diagnosis diagnosis) {
        this.diagnosis = diagnosis;
    }

    public Receipt diagnosis(Diagnosis diagnosis) {
        this.setDiagnosis(diagnosis);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Receipt)) {
            return false;
        }
        return id != null && id.equals(((Receipt) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Receipt{" +
            "id=" + getId() +
            ", number=" + getNumber() +
            "}";
    }
}
