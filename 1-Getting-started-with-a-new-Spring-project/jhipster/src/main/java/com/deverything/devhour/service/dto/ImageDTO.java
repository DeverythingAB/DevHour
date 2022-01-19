package com.deverything.devhour.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Lob;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.deverything.devhour.domain.Image} entity.
 */
public class ImageDTO implements Serializable {

    private Long id;

    @Lob
    private byte[] image;

    private String imageContentType;
    private Boolean uploaded;

    private LocationDTO location;

    private DiagnosisDTO diagnosis;

    private PatientDTO patient;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Boolean getUploaded() {
        return uploaded;
    }

    public void setUploaded(Boolean uploaded) {
        this.uploaded = uploaded;
    }

    public LocationDTO getLocation() {
        return location;
    }

    public void setLocation(LocationDTO location) {
        this.location = location;
    }

    public DiagnosisDTO getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(DiagnosisDTO diagnosis) {
        this.diagnosis = diagnosis;
    }

    public PatientDTO getPatient() {
        return patient;
    }

    public void setPatient(PatientDTO patient) {
        this.patient = patient;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ImageDTO)) {
            return false;
        }

        ImageDTO imageDTO = (ImageDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, imageDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ImageDTO{" +
            "id=" + getId() +
            ", image='" + getImage() + "'" +
            ", uploaded='" + getUploaded() + "'" +
            ", location=" + getLocation() +
            ", diagnosis=" + getDiagnosis() +
            ", patient=" + getPatient() +
            "}";
    }
}
