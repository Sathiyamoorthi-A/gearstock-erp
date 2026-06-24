package com.gearstock.repository;

import com.gearstock.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT p.paymentMethod, SUM(p.amount) FROM Payment p WHERE p.paymentDate >= :since GROUP BY p.paymentMethod")
    List<Object[]> getPaymentAccumulationSince(@Param("since") LocalDateTime since);
}
