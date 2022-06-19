package com.deverything.devhour.reportservice.repository;

import com.deverything.devhour.reportservice.domain.OrderReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderReportRepository  extends JpaRepository<OrderReport, UUID> {
}
