package com.deverything.devhour.service.mapper;

import com.deverything.devhour.domain.Image;
import com.deverything.devhour.service.dto.ImageDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Image} and its DTO {@link ImageDTO}.
 */
@Mapper(componentModel = "spring", uses = { LocationMapper.class, DiagnosisMapper.class, PatientMapper.class })
public interface ImageMapper extends EntityMapper<ImageDTO, Image> {
    @Mapping(target = "location", source = "location", qualifiedByName = "id")
    @Mapping(target = "diagnosis", source = "diagnosis", qualifiedByName = "id")
    @Mapping(target = "patient", source = "patient", qualifiedByName = "id")
    ImageDTO toDto(Image s);
}
