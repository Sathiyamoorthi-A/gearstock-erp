package com.gearstock.controller;

import com.gearstock.model.Part;
import com.gearstock.model.Warehouse;
import com.gearstock.model.WarehouseStock;
import com.gearstock.repository.PartRepository;
import com.gearstock.repository.WarehouseRepository;
import com.gearstock.repository.WarehouseStockRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseStockRepository warehouseStockRepository;
    private final PartRepository partRepository;

    public WarehouseController(WarehouseRepository warehouseRepository, WarehouseStockRepository warehouseStockRepository, PartRepository partRepository) {
        this.warehouseRepository = warehouseRepository;
        this.warehouseStockRepository = warehouseStockRepository;
        this.partRepository = partRepository;
    }

    private boolean isAuthorized() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        String role = auth.getAuthorities().iterator().next().getAuthority();
        return "ROLE_ADMIN".equals(role) || "ROLE_WAREHOUSE_MGR".equals(role);
    }

    @GetMapping
    public ResponseEntity<List<Warehouse>> getAllWarehouses() {
        return ResponseEntity.ok(warehouseRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Warehouse> getWarehouseById(@PathVariable Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));
        return ResponseEntity.ok(warehouse);
    }

    @PostMapping
    public ResponseEntity<?> createWarehouse(@RequestBody Warehouse warehouse) {
        if (!isAuthorized()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Admin and Managers can create warehouses");
        }
        Warehouse saved = warehouseRepository.save(warehouse);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWarehouse(@PathVariable Long id, @RequestBody Warehouse details) {
        if (!isAuthorized()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Admin and Managers can modify warehouses");
        }
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        warehouse.setName(details.getName());
        warehouse.setCode(details.getCode());
        warehouse.setAddress(details.getAddress());
        warehouse.setActive(details.isActive());

        Warehouse saved = warehouseRepository.save(warehouse);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWarehouse(@PathVariable Long id) {
        if (!isAuthorized()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Admin and Managers can delete warehouses");
        }
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        // Delete associated stocks first
        List<WarehouseStock> stocks = warehouseStockRepository.findByWarehouse(warehouse);
        warehouseStockRepository.deleteAll(stocks);

        warehouseRepository.delete(warehouse);
        return ResponseEntity.ok("Warehouse deleted successfully");
    }

    @GetMapping("/{id}/stocks")
    public ResponseEntity<List<WarehouseStock>> getWarehouseStocks(@PathVariable Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));
        return ResponseEntity.ok(warehouseStockRepository.findByWarehouse(warehouse));
    }

    @PostMapping("/{id}/stocks")
    public ResponseEntity<?> updateWarehouseStock(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        if (!isAuthorized()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Admin and Managers can adjust warehouse stock");
        }
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        Long partId = ((Number) payload.get("partId")).longValue();
        int quantity = ((Number) payload.get("quantity")).intValue();

        Part part = partRepository.findById(partId)
                .orElseThrow(() -> new RuntimeException("Part not found"));

        WarehouseStock stock = warehouseStockRepository.findByPartAndWarehouse(part, warehouse)
                .orElse(WarehouseStock.builder().part(part).warehouse(warehouse).quantity(0).build());

        stock.setQuantity(quantity);
        WarehouseStock saved = warehouseStockRepository.save(stock);
        return ResponseEntity.ok(saved);
    }
}
