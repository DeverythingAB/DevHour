package com.deverything.devhour.reportservice.domain;

import javax.persistence.Entity;
import java.time.ZonedDateTime;

@Entity
public class CustomerReport extends Report{
    private Integer customers;
    private ZonedDateTime periodStart;
    private ZonedDateTime periodEnd;

    public Integer getCustomers() {
        return customers;
    }

    public void setCustomers(Integer customers) {
        this.customers = customers;
    }

    public ZonedDateTime getPeriodStart() {
        return periodStart;
    }

    public void setPeriodStart(ZonedDateTime periodStart) {
        this.periodStart = periodStart;
    }

    public ZonedDateTime getPeriodEnd() {
        return periodEnd;
    }

    public void setPeriodEnd(ZonedDateTime periodEnd) {
        this.periodEnd = periodEnd;
    }

    @Override
    public ReportType getReportType() {
        return ReportType.CUSTOMER;
    }
}
