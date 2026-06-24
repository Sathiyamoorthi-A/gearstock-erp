package com.gearstock.model;

import jakarta.persistence.*;

@Entity
@Table(name = "warehouse_stocks", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"part_id", "warehouse_id"})
})
public class WarehouseStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "part_id", nullable = false)
    private Part part;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private int quantity = 0;

    public WarehouseStock() {
    }

    public WarehouseStock(Long id, Part part, Warehouse warehouse, int quantity) {
        this.id = id;
        this.part = part;
        this.warehouse = warehouse;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Part getPart() {
        return part;
    }

    public void setPart(Part part) {
        this.part = part;
    }

    public Warehouse getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public static WarehouseStockBuilder builder() {
        return new WarehouseStockBuilder();
    }

    public static class WarehouseStockBuilder {
        private Long id;
        private Part part;
        private Warehouse warehouse;
        private int quantity = 0;

        public WarehouseStockBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public WarehouseStockBuilder part(Part part) {
            this.part = part;
            return this;
        }

        public WarehouseStockBuilder warehouse(Warehouse warehouse) {
            this.warehouse = warehouse;
            return this;
        }

        public WarehouseStockBuilder quantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public WarehouseStock build() {
            return new WarehouseStock(id, part, warehouse, quantity);
        }
    }
}
