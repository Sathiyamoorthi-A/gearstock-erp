package com.gearstock.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "parts")
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sku;

    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    private int quantity;

    private int reorderLevel = 10;

    private BigDecimal price;

    private BigDecimal costPrice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Part() {
    }

    public Part(Long id, String sku, String name, String description, Category category, int quantity, int reorderLevel, BigDecimal price, BigDecimal costPrice, Supplier supplier, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.category = category;
        this.quantity = quantity;
        this.reorderLevel = reorderLevel;
        this.price = price;
        this.costPrice = costPrice;
        this.supplier = supplier;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public Category getCategory() {
        return this.category;
    }

    public void setCategory(Category category) {
        this.category = category;
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

    public Supplier getSupplier() {
        return this.supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static PartBuilder builder() {
        return new PartBuilder();
    }

    public static class PartBuilder {
        private Long id;
        private String sku;
        private String name;
        private String description;
        private Category category;
        private int quantity;
        private int reorderLevel;
        private BigDecimal price;
        private BigDecimal costPrice;
        private Supplier supplier;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PartBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PartBuilder sku(String sku) {
            this.sku = sku;
            return this;
        }

        public PartBuilder name(String name) {
            this.name = name;
            return this;
        }

        public PartBuilder description(String description) {
            this.description = description;
            return this;
        }

        public PartBuilder category(Category category) {
            this.category = category;
            return this;
        }

        public PartBuilder quantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public PartBuilder reorderLevel(int reorderLevel) {
            this.reorderLevel = reorderLevel;
            return this;
        }

        public PartBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public PartBuilder costPrice(BigDecimal costPrice) {
            this.costPrice = costPrice;
            return this;
        }

        public PartBuilder supplier(Supplier supplier) {
            this.supplier = supplier;
            return this;
        }

        public PartBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PartBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Part build() {
            return new Part(this.id, this.sku, this.name, this.description, this.category, this.quantity, this.reorderLevel, this.price, this.costPrice, this.supplier, this.createdAt, this.updatedAt);
        }
    }
}
