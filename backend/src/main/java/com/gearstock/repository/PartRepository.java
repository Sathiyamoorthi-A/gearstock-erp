package com.gearstock.repository;

import com.gearstock.model.Category;
import com.gearstock.model.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartRepository extends JpaRepository<Part, Long> {

    List<Part> findByCategory(Category category);

    List<Part> findByQuantityLessThanEqual(int quantity);

    long countByCategory(Category category);

    List<Part> findBySkuContainingIgnoreCaseOrNameContainingIgnoreCase(String sku, String name);
}
