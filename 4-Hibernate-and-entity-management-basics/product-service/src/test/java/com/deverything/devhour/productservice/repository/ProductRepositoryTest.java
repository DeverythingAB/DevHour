package com.deverything.devhour.productservice.repository;

import com.deverything.devhour.productservice.domain.Product;
import com.deverything.devhour.productservice.domain.ProductVariant;
import com.deverything.devhour.productservice.domain.Size;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;


@DataJpaTest
public class ProductRepositoryTest {

    @Autowired
    TestEntityManager entityManager;

    @Autowired
    ProductRepository products;

    @Test
    public void testFindAll() {
        Product product = new Product();
        product.setName("Test Product");
        product.addVariant(getVariant(20.5D, Size.S));
        product.addVariant(getVariant(22, Size.M));
        product.addVariant(getVariant(23.5D, Size.L));

        entityManager.persist(product);

        List<Product> prds = products.findAll();

        assertThat(prds.size()).isEqualTo(1);

        Product p = prds.get(0);

        assertThat(p.getId()).isNotNull();
        assertThat(p.getName()).isEqualTo(product.getName());
        assertThat(p.getVariants().size()).isEqualTo(3);

        p.getVariants().forEach(v -> {
            assertThat(v.getId()).isNotNull();
        });
    }

    @Test
    public void testFindByName() {
        Product product = new Product();
        product.setName("Test Product");
        product.addVariant(getVariant(20.5D, Size.S));
        product.addVariant(getVariant(22, Size.M));
        product.addVariant(getVariant(23.5D, Size.L));

        entityManager.persist(product);

        //anyone see any problem?
        Optional<Product> prod = products.findByName("Test Product");

        assertThat(prod).isPresent();

        Product persistedProduct = prod.get();

        assertThat(persistedProduct.getId()).isNotNull();
        assertThat(persistedProduct.getName()).isEqualTo("Test Product");
    }

    @Test
    public void testFindBySize() {
        Product product = new Product();
        product.setName("Test Product");
        product.addVariant(getVariant(20.5D, Size.S));
        product.addVariant(getVariant(22, Size.M));
        product.addVariant(getVariant(23.5D, Size.L));

        entityManager.persist(product);

        List<Product> prods = products.findByVariantsSize(Size.M);

        assertThat(prods).isNotEmpty();
    }

    private ProductVariant getVariant(double price, Size size) {
        ProductVariant variant = new ProductVariant();
        variant.setName(size.name());
        variant.setPrice(price);
        variant.setSize(size);
        return variant;
    }

}