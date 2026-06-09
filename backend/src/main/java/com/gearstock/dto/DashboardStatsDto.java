package com.gearstock.dto;

import java.math.BigDecimal;

public class DashboardStatsDto {

    private long totalSkus;

    private long ordersToday;

    private BigDecimal revenueMtd;

    private long lowStockItems;

    private long newSkusThisMonth;

    private double orderChangePercent;

    private double revenueChangePercent;

    private long lowStockChange;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalSkus, long ordersToday, BigDecimal revenueMtd, long lowStockItems, long newSkusThisMonth, double orderChangePercent, double revenueChangePercent, long lowStockChange) {
        this.totalSkus = totalSkus;
        this.ordersToday = ordersToday;
        this.revenueMtd = revenueMtd;
        this.lowStockItems = lowStockItems;
        this.newSkusThisMonth = newSkusThisMonth;
        this.orderChangePercent = orderChangePercent;
        this.revenueChangePercent = revenueChangePercent;
        this.lowStockChange = lowStockChange;
    }

    public long getTotalSkus() {
        return this.totalSkus;
    }

    public void setTotalSkus(long totalSkus) {
        this.totalSkus = totalSkus;
    }

    public long getOrdersToday() {
        return this.ordersToday;
    }

    public void setOrdersToday(long ordersToday) {
        this.ordersToday = ordersToday;
    }

    public BigDecimal getRevenueMtd() {
        return this.revenueMtd;
    }

    public void setRevenueMtd(BigDecimal revenueMtd) {
        this.revenueMtd = revenueMtd;
    }

    public long getLowStockItems() {
        return this.lowStockItems;
    }

    public void setLowStockItems(long lowStockItems) {
        this.lowStockItems = lowStockItems;
    }

    public long getNewSkusThisMonth() {
        return this.newSkusThisMonth;
    }

    public void setNewSkusThisMonth(long newSkusThisMonth) {
        this.newSkusThisMonth = newSkusThisMonth;
    }

    public double getOrderChangePercent() {
        return this.orderChangePercent;
    }

    public void setOrderChangePercent(double orderChangePercent) {
        this.orderChangePercent = orderChangePercent;
    }

    public double getRevenueChangePercent() {
        return this.revenueChangePercent;
    }

    public void setRevenueChangePercent(double revenueChangePercent) {
        this.revenueChangePercent = revenueChangePercent;
    }

    public long getLowStockChange() {
        return this.lowStockChange;
    }

    public void setLowStockChange(long lowStockChange) {
        this.lowStockChange = lowStockChange;
    }

    public static DashboardStatsDtoBuilder builder() {
        return new DashboardStatsDtoBuilder();
    }

    public static class DashboardStatsDtoBuilder {
        private long totalSkus;
        private long ordersToday;
        private BigDecimal revenueMtd;
        private long lowStockItems;
        private long newSkusThisMonth;
        private double orderChangePercent;
        private double revenueChangePercent;
        private long lowStockChange;

        public DashboardStatsDtoBuilder totalSkus(long totalSkus) {
            this.totalSkus = totalSkus;
            return this;
        }

        public DashboardStatsDtoBuilder ordersToday(long ordersToday) {
            this.ordersToday = ordersToday;
            return this;
        }

        public DashboardStatsDtoBuilder revenueMtd(BigDecimal revenueMtd) {
            this.revenueMtd = revenueMtd;
            return this;
        }

        public DashboardStatsDtoBuilder lowStockItems(long lowStockItems) {
            this.lowStockItems = lowStockItems;
            return this;
        }

        public DashboardStatsDtoBuilder newSkusThisMonth(long newSkusThisMonth) {
            this.newSkusThisMonth = newSkusThisMonth;
            return this;
        }

        public DashboardStatsDtoBuilder orderChangePercent(double orderChangePercent) {
            this.orderChangePercent = orderChangePercent;
            return this;
        }

        public DashboardStatsDtoBuilder revenueChangePercent(double revenueChangePercent) {
            this.revenueChangePercent = revenueChangePercent;
            return this;
        }

        public DashboardStatsDtoBuilder lowStockChange(long lowStockChange) {
            this.lowStockChange = lowStockChange;
            return this;
        }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(this.totalSkus, this.ordersToday, this.revenueMtd, this.lowStockItems, this.newSkusThisMonth, this.orderChangePercent, this.revenueChangePercent, this.lowStockChange);
        }
    }
}
