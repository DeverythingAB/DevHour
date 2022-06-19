package com.deverything.devhour.reportservice.domain;

import javax.persistence.Entity;
import java.time.ZonedDateTime;

@Entity
public class OrderReport extends Report{
    private Integer orders;
    private Double totalSum;
    private ZonedDateTime periodStart;
    private ZonedDateTime periodEnd;

    public Integer getOrders() {
        return orders;
    }

    public void setOrders(Integer orders) {
        this.orders = orders;
    }

    public Double getTotalSum() {
        return totalSum;
    }

    public void setTotalSum(Double totalSum) {
        this.totalSum = totalSum;
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
        return ReportType.ORDER;
    }
}
