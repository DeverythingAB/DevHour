package com.deverything.devhour.reportservice.domain;

import javax.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private ReportType reportType;
    private ZonedDateTime creationDate;

    public UUID getId() {
        return id;
    }

    public abstract ReportType getReportType();

    public ZonedDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(ZonedDateTime creationDate) {
        this.creationDate = creationDate;
    }
}
