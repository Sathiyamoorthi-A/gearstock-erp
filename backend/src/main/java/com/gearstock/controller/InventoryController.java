package com.gearstock.controller;

import com.gearstock.dto.PartDto;
import com.gearstock.service.PartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parts")
public class InventoryController {
    public InventoryController(PartService partService) {
        this.partService = partService;
    }


    private final PartService partService;

    @GetMapping
    public ResponseEntity<List<PartDto>> getAllParts(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(partService.getAllParts(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartDto> getPartById(@PathVariable Long id) {
        return ResponseEntity.ok(partService.getPartById(id));
    }

    @PostMapping
    public ResponseEntity<PartDto> createPart(@RequestBody PartDto partDto) {
        return ResponseEntity.ok(partService.createPart(partDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PartDto> updatePart(@PathVariable Long id, @RequestBody PartDto partDto) {
        return ResponseEntity.ok(partService.updatePart(id, partDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePart(@PathVariable Long id) {
        partService.deletePart(id);
        return ResponseEntity.noContent().build();
    }
}
