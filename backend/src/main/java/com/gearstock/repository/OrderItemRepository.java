package com.gearstock.repository;

import com.gearstock.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi.part.sku, oi.part.name, SUM(oi.quantity), SUM(oi.quantity * oi.unitPrice) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.orderType = 'SALES' " +
           "AND oi.order.status <> 'CANCELLED' " +
           "AND oi.order.createdAt >= :since " +
           "GROUP BY oi.part.sku, oi.part.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> getItemsSoldSince(@Param("since") LocalDateTime since);

    @Query("SELECT oi.part.sku, oi.part.name, SUM(oi.quantity), SUM(oi.quantity * oi.unitPrice) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.orderType = 'SALES' " +
           "AND oi.order.status <> 'CANCELLED' " +
           "GROUP BY oi.part.sku, oi.part.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> getItemsSoldAllTime();
}
