package com.deverything.devhour.orderservice.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Customer implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "customer")
    @JsonIgnoreProperties(value = { "customer" })
    private List<Address> addresses;

    @OneToMany(mappedBy = "customer")
    @JsonIgnoreProperties(value = { "customer" })
    private List<Order> orders = new ArrayList<Order>();

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<Address> addresses) {
        if(this.addresses != null){
            this.addresses.forEach(a -> a.setCustomer(null));
        }
        if(addresses != null){
            addresses.forEach(a -> a.setCustomer(this));
        }
        this.addresses = addresses;
    }

    public List<Order> getOrders() {
        return orders;
    }
}
