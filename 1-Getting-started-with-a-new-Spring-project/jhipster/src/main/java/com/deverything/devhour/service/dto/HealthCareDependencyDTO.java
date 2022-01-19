package com.deverything.devhour.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.deverything.devhour.domain.HealthCareDependency} entity.
 */
public class HealthCareDependencyDTO implements Serializable {

    private Long id;

    @NotNull
    private String name;

    private LocationDTO location;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocationDTO getLocation() {
        return location;
    }

    public void setLocation(LocationDTO location) {
        this.location = location;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HealthCareDependencyDTO)) {
            return false;
        }

        HealthCareDependencyDTO healthCareDependencyDTO = (HealthCareDependencyDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, healthCareDependencyDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HealthCareDependencyDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", location=" + getLocation() +
            "}";
    }
}
