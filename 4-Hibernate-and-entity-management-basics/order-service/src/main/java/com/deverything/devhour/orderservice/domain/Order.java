package com.deverything.devhour.orderservice.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Entity(name = "customer_order")
public class Order implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Column(nullable = false)
    private ZonedDateTime timestamp;
    @ManyToOne(optional = false)
    @JsonIgnoreProperties(value = { "orders" })
    private Customer customer;
    @OneToMany(mappedBy = "order")
    @JsonIgnoreProperties(value = { "order" })
    private List<OrderProduct> orderProducts;
    @Column(nullable = false)
    private PaymentType paymentType;
    @Column(nullable = false)
    private Double subTotal;
    @Column(nullable = false)
    private Float tax;
    @Column(nullable = false)
    private Double total;

    public UUID getId() {
        return id;
    }

    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<OrderProduct> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProduct> orderProducts) {
        if(this.orderProducts != null){
            this.orderProducts.forEach(op -> op.setOrder(null));
        }
        if(orderProducts != null){
            orderProducts.forEach( op -> op.setOrder(this));
        }
        this.orderProducts = orderProducts;
    }

    public PaymentType getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }

    public Double getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(Double subTotal) {
        this.subTotal = subTotal;
    }

    public Float getTax() {
        return tax;
    }

    public void setTax(Float tax) {
        this.tax = tax;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
