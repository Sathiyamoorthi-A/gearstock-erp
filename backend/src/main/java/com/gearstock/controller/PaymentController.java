package com.gearstock.controller;

import com.gearstock.dto.PaymentSummaryDto;
import com.gearstock.model.Order;
import com.gearstock.model.Payment;
import com.gearstock.repository.OrderRepository;
import com.gearstock.repository.PaymentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentController(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Map<String, Object> payload) {
        Long orderId = ((Number) payload.get("orderId")).longValue();
        BigDecimal amount = BigDecimal.valueOf(((Number) payload.get("amount")).doubleValue());
        String method = (String) payload.get("paymentMethod");
        String txnId = (String) payload.get("transactionId");

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID " + orderId));

        Payment payment = Payment.builder()
                .order(order)
                .amount(amount)
                .paymentMethod(method)
                .transactionId(txnId)
                .paymentDate(LocalDateTime.now())
                .build();

        Payment saved = paymentRepository.save(payment);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/daily-summary")
    public ResponseEntity<PaymentSummaryDto> getDailySummary() {
        LocalDateTime since = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        List<Object[]> rawData = paymentRepository.getPaymentAccumulationSince(since);

        PaymentSummaryDto summary = new PaymentSummaryDto();
        BigDecimal cash = BigDecimal.ZERO;
        BigDecimal upi = BigDecimal.ZERO;
        BigDecimal card = BigDecimal.ZERO;
        BigDecimal bank = BigDecimal.ZERO;
        BigDecimal lend = BigDecimal.ZERO;

        for (Object[] row : rawData) {
            String method = (String) row[0];
            BigDecimal sum = row[1] instanceof BigDecimal ? (BigDecimal) row[1] : BigDecimal.valueOf(((Number) row[1]).doubleValue());

            if (method != null) {
                switch (method.toUpperCase()) {
                    case "CASH":
                        cash = sum;
                        break;
                    case "UPI":
                        upi = sum;
                        break;
                    case "CARD":
                    case "CARDS":
                        card = sum;
                        break;
                    case "BANK_TRANSFER":
                    case "BANK":
                        bank = sum;
                        break;
                    case "LENDING":
                    case "LENDINGS":
                        lend = sum;
                        break;
                }
            }
        }

        summary.setCashTotal(cash);
        summary.setUpiTotal(upi);
        summary.setCardTotal(card);
        summary.setBankTransferTotal(bank);
        summary.setLendingTotal(lend);
        summary.setOverallTotal(cash.add(upi).add(card).add(bank).add(lend));

        return ResponseEntity.ok(summary);
    }
}
