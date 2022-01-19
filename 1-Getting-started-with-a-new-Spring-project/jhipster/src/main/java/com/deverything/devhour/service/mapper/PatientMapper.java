package com.deverything.devhour.service.mapper;

import com.deverything.devhour.domain.Patient;
import com.deverything.devhour.service.dto.PatientDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Patient} and its DTO {@link PatientDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PatientMapper extends EntityMapper<PatientDTO, Patient> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PatientDTO toDtoId(Patient patient);
}
