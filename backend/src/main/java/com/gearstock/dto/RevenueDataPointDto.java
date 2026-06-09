package com.gearstock.dto;

import java.math.BigDecimal;

public class RevenueDataPointDto {

    private String date;

    private BigDecimal revenue;

    private int orders;

    public RevenueDataPointDto() {
    }

    public RevenueDataPointDto(String date, BigDecimal revenue, int orders) {
        this.date = date;
        this.revenue = revenue;
        this.orders = orders;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public BigDecimal getRevenue() {
        return this.revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public int getOrders() {
        return this.orders;
    }

    public void setOrders(int orders) {
        this.orders = orders;
    }

    public static RevenueDataPointDtoBuilder builder() {
        return new RevenueDataPointDtoBuilder();
    }

    public static class RevenueDataPointDtoBuilder {
        private String date;
        private BigDecimal revenue;
        private int orders;

        public RevenueDataPointDtoBuilder date(String date) {
            this.date = date;
            return this;
        }

        public RevenueDataPointDtoBuilder revenue(BigDecimal revenue) {
            this.revenue = revenue;
            return this;
        }

        public RevenueDataPointDtoBuilder orders(int orders) {
            this.orders = orders;
            return this;
        }

        public RevenueDataPointDto build() {
            return new RevenueDataPointDto(this.date, this.revenue, this.orders);
        }
    }
}
