package com.deverything.devhour.reportservice.repository;

import com.deverything.devhour.reportservice.domain.CustomerReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CustomerReportRepository extends JpaRepository<CustomerReport, UUID> {
}
