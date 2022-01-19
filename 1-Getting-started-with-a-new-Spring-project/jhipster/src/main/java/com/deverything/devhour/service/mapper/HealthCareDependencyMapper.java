package com.deverything.devhour.service.mapper;

import com.deverything.devhour.domain.HealthCareDependency;
import com.deverything.devhour.service.dto.HealthCareDependencyDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link HealthCareDependency} and its DTO {@link HealthCareDependencyDTO}.
 */
@Mapper(componentModel = "spring", uses = { LocationMapper.class })
public interface HealthCareDependencyMapper extends EntityMapper<HealthCareDependencyDTO, HealthCareDependency> {
    @Mapping(target = "location", source = "location", qualifiedByName = "id")
    HealthCareDependencyDTO toDto(HealthCareDependency s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    HealthCareDependencyDTO toDtoId(HealthCareDependency healthCareDependency);
}
