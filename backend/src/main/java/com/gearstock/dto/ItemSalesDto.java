package com.gearstock.dto;

import java.math.BigDecimal;

public class ItemSalesDto {
    private String sku;
    private String name;
    private Long quantitySold;
    private BigDecimal revenue;

    public ItemSalesDto() {
    }

    public ItemSalesDto(String sku, String name, Long quantitySold, BigDecimal revenue) {
        this.sku = sku;
        this.name = name;
        this.quantitySold = quantitySold;
        this.revenue = revenue;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(Long quantitySold) {
        this.quantitySold = quantitySold;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }
}
