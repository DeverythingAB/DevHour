package com.deverything.devhour.reportservice.repository;

import com.deverything.devhour.reportservice.domain.CustomerReport;
import com.deverything.devhour.reportservice.domain.OrderReport;
import com.deverything.devhour.reportservice.domain.Report;
import com.deverything.devhour.reportservice.domain.ReportType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class ReportRepositoryTest {

    @Autowired
    private OrderReportRepository orders;

    @Autowired
    private CustomerReportRepository customers;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void testGetAllCustomerReports(){
        persistReports();

        List<CustomerReport> customerReports = customers.findAll();
        assertThat(customerReports.size()).isEqualTo(1);
    }

    @Test
    public void testGetAllOrderReports(){
        persistReports();

        List<OrderReport> orderReports = orders.findAll();
        assertThat(orderReports.size()).isEqualTo(1);
    }

    @Test
    public void testGetAllReports(){
        persistReports();

        List<Report> reps = reportRepository.findAll();

        assertThat(reps).isNotEmpty();
        assertThat(reps.size()).isEqualTo(2);

        reps.forEach(r -> {
            if(r instanceof CustomerReport c){
                assertThat(c.getCustomers()).isEqualTo(10);
            } else if (r instanceof OrderReport o) {
                assertThat(o.getOrders()).isEqualTo(100);
            }else {
                throw new RuntimeException("Unknown order type: " + r.getClass());
            }
        });
    }

    @Test
    public void testFindAllMap(){
        persistReports();

        Map<ReportType, List<Report>> map = reportRepository.findAllMap();
        assertThat(map).isNotEmpty();
        assertThat(map.values().size()).isEqualTo(2);
        assertThat(map.get(ReportType.ORDER).size()).isEqualTo(1);
        assertThat(map.get(ReportType.CUSTOMER).size()).isEqualTo(1);
        System.out.println(map.keySet());
    }

    private void persistReports() {
        CustomerReport customerReport = new CustomerReport();
        customerReport.setCustomers(10);
        customerReport.setPeriodStart(ZonedDateTime.now());
        customerReport.setPeriodEnd(ZonedDateTime.now().plusMonths(1));
        customerReport.setCreationDate(ZonedDateTime.now());

        OrderReport orderReport = new OrderReport();
        orderReport.setOrders(100);
        orderReport.setTotalSum(100100.100);
        orderReport.setPeriodStart(ZonedDateTime.now());
        orderReport.setPeriodEnd(ZonedDateTime.now().plusMonths(1));
        orderReport.setCreationDate(ZonedDateTime.now());

        entityManager.persist(customerReport);
        entityManager.persist(orderReport);

    }
}