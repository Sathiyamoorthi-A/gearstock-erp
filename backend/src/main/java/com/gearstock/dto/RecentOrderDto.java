package com.gearstock.dto;

import java.math.BigDecimal;

public class RecentOrderDto {

    private String orderId;

    private String partDescription;

    private int quantity;

    private BigDecimal amount;

    private String status;

    public RecentOrderDto() {
    }

    public RecentOrderDto(String orderId, String partDescription, int quantity, BigDecimal amount, String status) {
        this.orderId = orderId;
        this.partDescription = partDescription;
        this.quantity = quantity;
        this.amount = amount;
        this.status = status;
    }

    public String getOrderId() {
        return this.orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getPartDescription() {
        return this.partDescription;
    }

    public void setPartDescription(String partDescription) {
        this.partDescription = partDescription;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public static RecentOrderDtoBuilder builder() {
        return new RecentOrderDtoBuilder();
    }

    public static class RecentOrderDtoBuilder {
        private String orderId;
        private String partDescription;
        private int quantity;
        private BigDecimal amount;
        private String status;

        public RecentOrderDtoBuilder orderId(String orderId) {
            this.orderId = orderId;
            return this;
        }

        public RecentOrderDtoBuilder partDescription(String partDescription) {
            this.partDescription = partDescription;
            return this;
        }

        public RecentOrderDtoBuilder quantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public RecentOrderDtoBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public RecentOrderDtoBuilder status(String status) {
            this.status = status;
            return this;
        }

        public RecentOrderDto build() {
            return new RecentOrderDto(this.orderId, this.partDescription, this.quantity, this.amount, this.status);
        }
    }
}
