package com.deverything.devhour.productservice.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Product implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties(value = {"product"}, allowSetters = true)
    private List<ProductVariant> variants = new ArrayList<ProductVariant>();


    public UUID getId() {
        return id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ProductVariant> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariant> variants) {
        if (this.variants != null) {
            this.variants.forEach(v -> v.setProduct(null));
        }

        if (variants != null) {
            variants.forEach(v -> v.setProduct(this));
        }
        this.variants = variants;
    }

    public Product addVariant(ProductVariant productVariant) {
        this.getVariants().add(productVariant);
        productVariant.setProduct(this);
        return this;
    }


    @Override
    public String toString() {
        return "Product{" +
                "id=" + getId() +
                ", name='" + getName() + "'" +
                "}";
    }


}