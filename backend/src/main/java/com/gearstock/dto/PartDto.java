package com.gearstock.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PartDto {

    private Long id;

    private String sku;

    private String name;

    private String description;

    private String categoryName;

    private int quantity;

    private int reorderLevel;

    private BigDecimal price;

    private BigDecimal costPrice;

    private String supplierName;

    private LocalDateTime createdAt;

    public PartDto() {
    }

    public PartDto(Long id, String sku, String name, String description, String categoryName, int quantity, int reorderLevel, BigDecimal price, BigDecimal costPrice, String supplierName, LocalDateTime createdAt) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.categoryName = categoryName;
        this.quantity = quantity;
        this.reorderLevel = reorderLevel;
        this.price = price;
        this.costPrice = costPrice;
        this.supplierName = supplierName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return this.sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategoryName() {
        return this.categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getReorderLevel() {
        return this.reorderLevel;
    }

    public void setReorderLevel(int reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getCostPrice() {
        return this.costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public String getSupplierName() {
        return this.supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static PartDtoBuilder builder() {
        return new PartDtoBuilder();
    }

    public static class PartDtoBuilder {
        private Long id;
        private String sku;
        private String name;
        private String description;
        private String categoryName;
        private int quantity;
        private int reorderLevel;
        private BigDecimal price;
        private BigDecimal costPrice;
        private String supplierName;
        private LocalDateTime createdAt;

        public PartDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PartDtoBuilder sku(String sku) {
            this.sku = sku;
            return this;
        }

        public PartDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public PartDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public PartDtoBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public PartDtoBuilder quantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public PartDtoBuilder reorderLevel(int reorderLevel) {
            this.reorderLevel = reorderLevel;
            return this;
        }

        public PartDtoBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public PartDtoBuilder costPrice(BigDecimal costPrice) {
            this.costPrice = costPrice;
            return this;
        }

        public PartDtoBuilder supplierName(String supplierName) {
            this.supplierName = supplierName;
            return this;
        }

        public PartDtoBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PartDto build() {
            return new PartDto(this.id, this.sku, this.name, this.description, this.categoryName, this.quantity, this.reorderLevel, this.price, this.costPrice, this.supplierName, this.createdAt);
        }
    }
}
