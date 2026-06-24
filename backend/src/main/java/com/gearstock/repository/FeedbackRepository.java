package com.gearstock.repository;

import com.gearstock.model.Customer;
import com.gearstock.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByCustomer(Customer customer);
    List<Feedback> findTop10ByOrderByCreatedAtDesc();
}
