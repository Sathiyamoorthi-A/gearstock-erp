package com.gearstock.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false)
    private int rating; // 1-5 stars

    private String comments;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Feedback() {
    }

    public Feedback(Long id, Customer customer, Order order, int rating, String comments, LocalDateTime createdAt) {
        this.id = id;
        this.customer = customer;
        this.order = order;
        this.rating = rating;
        this.comments = comments;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static FeedbackBuilder builder() {
        return new FeedbackBuilder();
    }

    public static class FeedbackBuilder {
        private Long id;
        private Customer customer;
        private Order order;
        private int rating;
        private String comments;
        private LocalDateTime createdAt;

        public FeedbackBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public FeedbackBuilder customer(Customer customer) {
            this.customer = customer;
            return this;
        }

        public FeedbackBuilder order(Order order) {
            this.order = order;
            return this;
        }

        public FeedbackBuilder rating(int rating) {
            this.rating = rating;
            return this;
        }

        public FeedbackBuilder comments(String comments) {
            this.comments = comments;
            return this;
        }

        public FeedbackBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Feedback build() {
            return new Feedback(id, customer, order, rating, comments, createdAt != null ? createdAt : LocalDateTime.now());
        }
    }
}
