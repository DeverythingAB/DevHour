package com.deverything.devhour.reportservice.repository;

import com.deverything.devhour.reportservice.domain.Report;
import com.deverything.devhour.reportservice.domain.ReportType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

    default Map<ReportType, List<Report>> findAllMap(){
        return findAll().stream().collect(Collectors.groupingBy(Report::getReportType, mapping(Function.identity(), toList())));
    }
}
