package com.gearstock.service;

import com.gearstock.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    
    // Thread-safe in-memory notification log
    private final List<Map<String, String>> logs = new CopyOnWriteArrayList<>();

    public void sendOrderNotification(Order order) {
        String status = order.getStatus();
        String orderNo = order.getOrderNumber() != null ? order.getOrderNumber() : ("#ORD-" + order.getId());
        String customerName = order.getCustomer() != null ? order.getCustomer().getName() : "Valued Customer";
        String customerPhone = order.getCustomer() != null ? order.getCustomer().getPhone() : "+91-99999-99999";
        String customerEmail = order.getCustomer() != null ? order.getCustomer().getEmail() : "customer@gearstock.in";

        String emailSubject = "";
        String emailBody = "";
        String smsText = "";

        switch (status.toUpperCase()) {
            case "PENDING":
                emailSubject = "GearStock Order Received: " + orderNo;
                emailBody = "Hello " + customerName + ",\n\nWe have received your sales order " + orderNo + " for a total of Rs." + order.getTotalAmount() + ". It is currently PENDING review.";
                smsText = "GearStock: Hi " + customerName + ", your order " + orderNo + " for Rs." + order.getTotalAmount() + " is received and pending approval.";
                break;
            case "APPROVED":
            case "PROCESSING":
                emailSubject = "GearStock Order Approved & Packaging: " + orderNo;
                emailBody = "Hello " + customerName + ",\n\nGood news! Your order " + orderNo + " has been APPROVED and is now being packaged in our warehouse.";
                smsText = "GearStock: Great news! Your order " + orderNo + " has been approved and is being packaged.";
                break;
            case "SHIPPED":
            case "IN_TRANSIT":
                emailSubject = "GearStock Order In Transit: " + orderNo;
                emailBody = "Hello " + customerName + ",\n\nYour order " + orderNo + " has been dispatched from our warehouse and is now IN TRANSIT.";
                smsText = "GearStock: Your order " + orderNo + " is dispatched and in transit.";
                break;
            case "DELIVERED":
                emailSubject = "GearStock Order Delivered: " + orderNo;
                emailBody = "Hello " + customerName + ",\n\nYour order " + orderNo + " has been successfully DELIVERED. Thank you for choosing GearStock ERP!";
                smsText = "GearStock: Your order " + orderNo + " has been delivered. Thank you!";
                break;
            case "CANCELLED":
                emailSubject = "GearStock Order Cancelled: " + orderNo;
                emailBody = "Hello " + customerName + ",\n\nYour order " + orderNo + " has been CANCELLED.";
                smsText = "GearStock: Your order " + orderNo + " has been cancelled.";
                break;
            default:
                emailSubject = "GearStock Order Update: " + orderNo;
                emailBody = "Hello " + customerName + ",\n\nYour order " + orderNo + " has been updated to status: " + status + ".";
                smsText = "GearStock: Order " + orderNo + " status updated to " + status + ".";
                break;
        }

        // 1. Print to backend console log
        log.info("=========================================");
        log.info("CRM AUTOMATION LOG — SENDING NOTIFICATIONS");
        log.info("To: {} ({}) / Email: {}", customerName, customerPhone, customerEmail);
        log.info("-----------------------------------------");
        log.info("SMS TEXT:  {}", smsText);
        log.info("EMAIL SUBJ: {}", emailSubject);
        log.info("EMAIL BODY: {}", emailBody);
        log.info("=========================================");

        // 2. Add to in-memory logs
        Map<String, String> entry = new HashMap<>();
        entry.put("id", UUID.randomUUID().toString());
        entry.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        entry.put("orderNo", orderNo);
        entry.put("customer", customerName);
        entry.put("status", status);
        entry.put("smsText", smsText);
        entry.put("emailSubject", emailSubject);
        entry.put("emailBody", emailBody);

        // Keep last 50 logs only
        if (logs.size() >= 50) {
            logs.remove(0);
        }
        logs.add(entry);
    }

    public List<Map<String, String>> getLogs() {
        return new ArrayList<>(logs);
    }
}
