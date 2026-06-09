package com.gearstock.controller;

import com.gearstock.dto.*;
import com.gearstock.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }


    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/revenue-chart")
    public ResponseEntity<List<RevenueDataPointDto>> getRevenueChart() {
        return ResponseEntity.ok(dashboardService.getRevenueChart());
    }

    @GetMapping("/category-distribution")
    public ResponseEntity<List<CategoryDistributionDto>> getCategoryDistribution() {
        return ResponseEntity.ok(dashboardService.getCategoryDistribution());
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<RecentOrderDto>> getRecentOrders() {
        return ResponseEntity.ok(dashboardService.getRecentOrders());
    }

    @GetMapping("/low-stock-alerts")
    public ResponseEntity<List<LowStockAlertDto>> getLowStockAlerts() {
        return ResponseEntity.ok(dashboardService.getLowStockAlerts());
    }
}
