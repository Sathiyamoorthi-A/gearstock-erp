package com.gearstock.model;

import jakarta.persistence.*;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    private String address;

    private boolean active = true;

    public Warehouse() {
    }

    public Warehouse(Long id, String name, String code, String address, boolean active) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.address = address;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public static WarehouseBuilder builder() {
        return new WarehouseBuilder();
    }

    public static class WarehouseBuilder {
        private Long id;
        private String name;
        private String code;
        private String address;
        private boolean active = true;

        public WarehouseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public WarehouseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public WarehouseBuilder code(String code) {
            this.code = code;
            return this;
        }

        public WarehouseBuilder address(String address) {
            this.address = address;
            return this;
        }

        public WarehouseBuilder active(boolean active) {
            this.active = active;
            return this;
        }

        public Warehouse build() {
            return new Warehouse(id, name, code, address, active);
        }
    }
}
