package com.gearstock.service;

import com.gearstock.exception.ResourceNotFoundException;
import com.gearstock.model.Order;
import com.gearstock.model.OrderItem;
import com.gearstock.model.Part;
import com.gearstock.repository.OrderRepository;
import com.gearstock.repository.PartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final PartRepository partRepository;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository, PartRepository partRepository, NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.partRepository = partRepository;
        this.notificationService = notificationService;
    }

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

    @Transactional
    public Order createOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        
        if (order.getOrderNumber() == null || order.getOrderNumber().trim().isEmpty()) {
            long count = orderRepository.count() + 1;
            String prefix = "SALES".equalsIgnoreCase(order.getOrderType()) ? "#SO-78" : "#PO-42";
            order.setOrderNumber(prefix + String.format("%03d", count));
        }

        if (order.getItems() != null) {
            order.getItems().forEach(item -> {
                item.setOrder(order);
                // Deduct stock for SALES order
                if ("SALES".equalsIgnoreCase(order.getOrderType())) {
                    Part part = partRepository.findById(item.getPart().getId())
                            .orElseThrow(() -> new RuntimeException("Part not found with ID " + item.getPart().getId()));
                    part.setQuantity(Math.max(0, part.getQuantity() - item.getQuantity()));
                    partRepository.save(part);
                }
            });
        }
        
        Order savedOrder = orderRepository.save(order);
        
        // Trigger automated CRM notifications
        notificationService.sendOrderNotification(savedOrder);
        
        return savedOrder;
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        
        String oldStatus = order.getStatus();
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        // If status changes to DELIVERED and it is a PURCHASE order, increase stock
        if ("PURCHASE".equalsIgnoreCase(order.getOrderType()) && "DELIVERED".equalsIgnoreCase(status) && !"DELIVERED".equalsIgnoreCase(oldStatus)) {
            if (order.getItems() != null) {
                order.getItems().forEach(item -> {
                    Part part = partRepository.findById(item.getPart().getId())
                            .orElseThrow(() -> new RuntimeException("Part not found with ID " + item.getPart().getId()));
                    part.setQuantity(part.getQuantity() + item.getQuantity());
                    partRepository.save(part);
                });
            }
        }

        // Return stock for cancelled SALES order
        if ("SALES".equalsIgnoreCase(order.getOrderType()) && "CANCELLED".equalsIgnoreCase(status) && !"CANCELLED".equalsIgnoreCase(oldStatus)) {
            if (order.getItems() != null) {
                order.getItems().forEach(item -> {
                    Part part = partRepository.findById(item.getPart().getId())
                            .orElseThrow(() -> new RuntimeException("Part not found with ID " + item.getPart().getId()));
                    part.setQuantity(part.getQuantity() + item.getQuantity());
                    partRepository.save(part);
                });
            }
        }

        Order saved = orderRepository.save(order);
        
        // Trigger automated CRM notifications
        notificationService.sendOrderNotification(saved);
        
        return saved;
    }

    @Transactional
    public Order updateOrder(Long id, Order updatedOrder) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only PENDING status orders can be edited.");
        }

        // 1. Reverse old stock adjustments for SALES orders
        if ("SALES".equalsIgnoreCase(order.getOrderType())) {
            if (order.getItems() != null) {
                order.getItems().forEach(oldItem -> {
                    Part part = partRepository.findById(oldItem.getPart().getId())
                            .orElseThrow(() -> new RuntimeException("Part not found with ID " + oldItem.getPart().getId()));
                    part.setQuantity(part.getQuantity() + oldItem.getQuantity());
                    partRepository.save(part);
                });
            }
        }

        // 2. Clear old items and prepare new items list
        order.getItems().clear();

        // 3. Apply new stock adjustments & add new items
        if (updatedOrder.getItems() != null) {
            for (OrderItem newItem : updatedOrder.getItems()) {
                newItem.setOrder(order);
                order.getItems().add(newItem);

                if ("SALES".equalsIgnoreCase(order.getOrderType())) {
                    Part part = partRepository.findById(newItem.getPart().getId())
                            .orElseThrow(() -> new RuntimeException("Part not found with ID " + newItem.getPart().getId()));
                    part.setQuantity(Math.max(0, part.getQuantity() - newItem.getQuantity()));
                    partRepository.save(part);
                }
            }
        }

        order.setNotes(updatedOrder.getNotes());
        order.setCustomer(updatedOrder.getCustomer());
        order.setSupplier(updatedOrder.getSupplier());
        order.setTotalAmount(updatedOrder.getTotalAmount());
        order.setUpdatedAt(LocalDateTime.now());

        Order saved = orderRepository.save(order);

        // Trigger notification
        notificationService.sendOrderNotification(saved);

        return saved;
    }
}
