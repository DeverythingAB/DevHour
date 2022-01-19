package com.deverything.devhour.service.mapper;

import com.deverything.devhour.domain.Diagnosis;
import com.deverything.devhour.service.dto.DiagnosisDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Diagnosis} and its DTO {@link DiagnosisDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DiagnosisMapper extends EntityMapper<DiagnosisDTO, Diagnosis> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DiagnosisDTO toDtoId(Diagnosis diagnosis);
}
