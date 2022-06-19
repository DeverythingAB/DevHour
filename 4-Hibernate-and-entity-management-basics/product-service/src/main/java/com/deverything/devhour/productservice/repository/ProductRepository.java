package com.deverything.devhour.productservice.repository;


import com.deverything.devhour.productservice.domain.Product;
import com.deverything.devhour.productservice.domain.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findByName(String test_product);
    List<Product> findByVariantsSize(Size size);
}
