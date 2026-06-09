package com.gearstock.service;

import com.gearstock.exception.ResourceNotFoundException;
import com.gearstock.model.Order;
import com.gearstock.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


    private final OrderRepository orderRepository;

    public List<Order> getAllOrders(String type) {
        if (type != null && !type.trim().isEmpty()) {
            return orderRepository.findByOrderType(type.toUpperCase());
        }
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    public Order createOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
}
