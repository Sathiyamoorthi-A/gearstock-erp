package com.gearstock.repository;

import com.gearstock.model.Part;
import com.gearstock.model.Warehouse;
import com.gearstock.model.WarehouseStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseStockRepository extends JpaRepository<WarehouseStock, Long> {
    Optional<WarehouseStock> findByPartAndWarehouse(Part part, Warehouse warehouse);
    List<WarehouseStock> findByWarehouse(Warehouse warehouse);
    List<WarehouseStock> findByPart(Part part);
}
