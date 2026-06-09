package com.gearstock.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String contactPerson;

    private String email;

    private String phone;

    private String address;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Supplier() {
    }

    public Supplier(Long id, String name, String contactPerson, String email, String phone, String address, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactPerson() {
        return this.contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static SupplierBuilder builder() {
        return new SupplierBuilder();
    }

    public static class SupplierBuilder {
        private Long id;
        private String name;
        private String contactPerson;
        private String email;
        private String phone;
        private String address;
        private LocalDateTime createdAt;

        public SupplierBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SupplierBuilder name(String name) {
            this.name = name;
            return this;
        }

        public SupplierBuilder contactPerson(String contactPerson) {
            this.contactPerson = contactPerson;
            return this;
        }

        public SupplierBuilder email(String email) {
            this.email = email;
            return this;
        }

        public SupplierBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public SupplierBuilder address(String address) {
            this.address = address;
            return this;
        }

        public SupplierBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Supplier build() {
            return new Supplier(this.id, this.name, this.contactPerson, this.email, this.phone, this.address, this.createdAt);
        }
    }
}
