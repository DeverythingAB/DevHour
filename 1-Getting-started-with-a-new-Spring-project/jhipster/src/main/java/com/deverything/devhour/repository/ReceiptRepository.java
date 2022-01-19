package com.deverything.devhour.repository;

import com.deverything.devhour.domain.Receipt;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Receipt entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {}
