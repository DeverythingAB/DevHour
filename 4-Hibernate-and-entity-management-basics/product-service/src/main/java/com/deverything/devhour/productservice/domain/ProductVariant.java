package com.deverything.devhour.productservice.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.UUID;

@Entity
@Data
public class ProductVariant implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "price", nullable = false)
    private Double price;


    @NotNull
    @ManyToOne(optional = false)
    @JsonIgnoreProperties(value = {"variants"}, allowSetters = true)
    private Product product;

    @Enumerated(EnumType.STRING)
    private Size size;

    @Override
    public String toString() {
        return "ProductVariant{" +
                "id=" + getId() +
                ", name='" + getName() + "'" +
                ", size='" + getSize() + "'" +
                ", price='" + getPrice() + "'" +
                "}";
    }


}
