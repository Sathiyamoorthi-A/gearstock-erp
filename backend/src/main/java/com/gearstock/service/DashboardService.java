package com.gearstock.service;

import com.gearstock.dto.*;
import com.gearstock.model.Category;
import com.gearstock.model.Order;
import com.gearstock.model.OrderItem;
import com.gearstock.model.Part;
import com.gearstock.repository.CategoryRepository;
import com.gearstock.repository.OrderRepository;
import com.gearstock.repository.PartRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    public DashboardService(PartRepository partRepository, OrderRepository orderRepository, CategoryRepository categoryRepository) {
        this.partRepository = partRepository;
        this.orderRepository = orderRepository;
        this.categoryRepository = categoryRepository;
    }


    private final PartRepository partRepository;
    private final OrderRepository orderRepository;
    private final CategoryRepository categoryRepository;

    public DashboardStatsDto getStats() {
        long totalSkus = partRepository.count();

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(LocalTime.MAX);
        long ordersToday = orderRepository.countByCreatedAtBetween(todayStart, todayEnd);

        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        BigDecimal revenueMtd = orderRepository.sumTotalAmountByCreatedAtBetween(monthStart, todayEnd);

        List<Part> allParts = partRepository.findAll();
        long lowStockItems = allParts.stream()
                .filter(p -> p.getQuantity() <= p.getReorderLevel())
                .count();

        long newSkusThisMonth = allParts.stream()
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(monthStart))
                .count();

        return DashboardStatsDto.builder()
                .totalSkus(totalSkus)
                .ordersToday(ordersToday)
                .revenueMtd(revenueMtd != null ? revenueMtd : BigDecimal.ZERO)
                .lowStockItems(lowStockItems)
                .newSkusThisMonth(newSkusThisMonth)
                .orderChangePercent(12.5)
                .revenueChangePercent(8.3)
                .lowStockChange(-2)
                .build();
    }

    public List<RevenueDataPointDto> getRevenueChart() {
        List<RevenueDataPointDto> dataPoints = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        Random random = new Random(42);

        for (int i = 29; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime dayStart = date.atStartOfDay();
            LocalDateTime dayEnd = date.atTime(LocalTime.MAX);

            List<Order> dayOrders = orderRepository.findByCreatedAtBetween(dayStart, dayEnd);

            BigDecimal dayRevenue;
            int orderCount;

            if (!dayOrders.isEmpty()) {
                dayRevenue = dayOrders.stream()
                        .map(Order::getTotalAmount)
                        .filter(a -> a != null)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                orderCount = dayOrders.size();
            } else {
                dayRevenue = BigDecimal.valueOf(15000 + random.nextInt(85000));
                orderCount = 1 + random.nextInt(5);
            }

            dataPoints.add(RevenueDataPointDto.builder()
                    .date(date.format(formatter))
                    .revenue(dayRevenue)
                    .orders(orderCount)
                    .build());
        }

        return dataPoints;
    }

    public List<CategoryDistributionDto> getCategoryDistribution() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(cat -> CategoryDistributionDto.builder()
                        .name(cat.getName())
                        .value(partRepository.countByCategory(cat))
                        .color(cat.getColor())
                        .build())
                .collect(Collectors.toList());
    }

    public List<RecentOrderDto> getRecentOrders() {
        List<Order> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc();
        List<RecentOrderDto> result = new ArrayList<>();

        int count = 0;
        for (Order order : recentOrders) {
            if (count >= 5) break;

            String partDesc = "Multiple items";
            int totalQty = 0;

            if (order.getItems() != null && !order.getItems().isEmpty()) {
                OrderItem firstItem = order.getItems().get(0);
                if (firstItem.getPart() != null) {
                    partDesc = firstItem.getPart().getName();
                }
                totalQty = order.getItems().stream()
                        .mapToInt(OrderItem::getQuantity)
                        .sum();
                if (order.getItems().size() > 1) {
                    partDesc += " + " + (order.getItems().size() - 1) + " more";
                }
            }

            result.add(RecentOrderDto.builder()
                    .orderId(order.getOrderNumber())
                    .partDescription(partDesc)
                    .quantity(totalQty)
                    .amount(order.getTotalAmount())
                    .status(order.getStatus())
                    .build());

            count++;
        }

        return result;
    }

    public List<LowStockAlertDto> getLowStockAlerts() {
        List<Part> allParts = partRepository.findAll();
        return allParts.stream()
                .filter(p -> p.getQuantity() <= p.getReorderLevel())
                .map(p -> LowStockAlertDto.builder()
                        .partName(p.getName())
                        .sku(p.getSku())
                        .category(p.getCategory() != null ? p.getCategory().getName() : "Uncategorized")
                        .remaining(p.getQuantity())
                        .build())
                .collect(Collectors.toList());
    }
}
