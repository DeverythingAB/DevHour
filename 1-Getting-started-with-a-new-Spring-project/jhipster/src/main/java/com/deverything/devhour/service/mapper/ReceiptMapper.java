package com.deverything.devhour.service.mapper;

import com.deverything.devhour.domain.Receipt;
import com.deverything.devhour.service.dto.ReceiptDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Receipt} and its DTO {@link ReceiptDTO}.
 */
@Mapper(componentModel = "spring", uses = { HealthCareDependencyMapper.class, DiagnosisMapper.class })
public interface ReceiptMapper extends EntityMapper<ReceiptDTO, Receipt> {
    @Mapping(target = "healthCareDependency", source = "healthCareDependency", qualifiedByName = "id")
    @Mapping(target = "diagnosis", source = "diagnosis", qualifiedByName = "id")
    ReceiptDTO toDto(Receipt s);
}
