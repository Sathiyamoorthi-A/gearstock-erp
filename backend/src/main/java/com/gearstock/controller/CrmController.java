package com.gearstock.controller;

import com.gearstock.model.Customer;
import com.gearstock.model.Feedback;
import com.gearstock.model.Order;
import com.gearstock.repository.CustomerRepository;
import com.gearstock.repository.FeedbackRepository;
import com.gearstock.repository.OrderRepository;
import com.gearstock.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crm")
public class CrmController {

    private final FeedbackRepository feedbackRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    public CrmController(FeedbackRepository feedbackRepository, CustomerRepository customerRepository, OrderRepository orderRepository, NotificationService notificationService) {
        this.feedbackRepository = feedbackRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<Feedback>> getFeedbacks() {
        return ResponseEntity.ok(feedbackRepository.findTop10ByOrderByCreatedAtDesc());
    }

    @PostMapping("/feedback")
    public ResponseEntity<Feedback> createFeedback(@RequestBody Map<String, Object> payload) {
        Long customerId = ((Number) payload.get("customerId")).longValue();
        int rating = ((Number) payload.get("rating")).intValue();
        String comments = (String) payload.get("comments");

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Order order = null;
        if (payload.containsKey("orderId") && payload.get("orderId") != null) {
            Long orderId = ((Number) payload.get("orderId")).longValue();
            order = orderRepository.findById(orderId).orElse(null);
        }

        Feedback feedback = Feedback.builder()
                .customer(customer)
                .order(order)
                .rating(rating)
                .comments(comments)
                .createdAt(LocalDateTime.now())
                .build();

        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/notifications-log")
    public ResponseEntity<List<Map<String, String>>> getNotificationsLog() {
        return ResponseEntity.ok(notificationService.getLogs());
    }
}
