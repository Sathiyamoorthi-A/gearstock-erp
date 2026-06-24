package com.gearstock.controller;

import com.gearstock.model.Order;
import com.gearstock.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(@RequestParam(required = false) String type) {
        return ResponseEntity.ok(orderService.getAllOrders(type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(
            @PathVariable Long id,
            @RequestBody Order order
    ) {
        return ResponseEntity.ok(orderService.updateOrder(id, order));
    }
}
