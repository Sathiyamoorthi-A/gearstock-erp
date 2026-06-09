package com.gearstock.service;

import com.gearstock.dto.PartDto;
import com.gearstock.exception.ResourceNotFoundException;
import com.gearstock.model.Category;
import com.gearstock.model.Part;
import com.gearstock.model.Supplier;
import com.gearstock.repository.CategoryRepository;
import com.gearstock.repository.PartRepository;
import com.gearstock.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PartService {
    public PartService(PartRepository partRepository, CategoryRepository categoryRepository, SupplierRepository supplierRepository) {
        this.partRepository = partRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
    }


    private final PartRepository partRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    public List<PartDto> getAllParts(String search) {
        List<Part> parts;
        if (search != null && !search.trim().isEmpty()) {
            parts = partRepository.findBySkuContainingIgnoreCaseOrNameContainingIgnoreCase(search, search);
        } else {
            parts = partRepository.findAll();
        }
        return parts.stream().map(this::toDto).collect(Collectors.toList());
    }

    public PartDto getPartById(Long id) {
        Part part = partRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id: " + id));
        return toDto(part);
    }

    public PartDto createPart(PartDto dto) {
        Part part = new Part();
        mapDtoToEntity(dto, part);
        part.setCreatedAt(LocalDateTime.now());
        part.setUpdatedAt(LocalDateTime.now());
        Part saved = partRepository.save(part);
        return toDto(saved);
    }

    public PartDto updatePart(Long id, PartDto dto) {
        Part part = partRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id: " + id));
        mapDtoToEntity(dto, part);
        part.setUpdatedAt(LocalDateTime.now());
        Part saved = partRepository.save(part);
        return toDto(saved);
    }

    public void deletePart(Long id) {
        if (!partRepository.existsById(id)) {
            throw new ResourceNotFoundException("Part not found with id: " + id);
        }
        partRepository.deleteById(id);
    }

    private void mapDtoToEntity(PartDto dto, Part part) {
        part.setSku(dto.getSku());
        part.setName(dto.getName());
        part.setDescription(dto.getDescription());
        part.setQuantity(dto.getQuantity());
        part.setReorderLevel(dto.getReorderLevel());
        part.setPrice(dto.getPrice());
        part.setCostPrice(dto.getCostPrice());

        if (dto.getCategoryName() != null) {
            Category category = categoryRepository.findByName(dto.getCategoryName());
            part.setCategory(category);
        }
        if (dto.getSupplierName() != null) {
            Supplier supplier = supplierRepository.findByName(dto.getSupplierName());
            part.setSupplier(supplier);
        }
    }

    private PartDto toDto(Part part) {
        return PartDto.builder()
                .id(part.getId())
                .sku(part.getSku())
                .name(part.getName())
                .description(part.getDescription())
                .categoryName(part.getCategory() != null ? part.getCategory().getName() : null)
                .quantity(part.getQuantity())
                .reorderLevel(part.getReorderLevel())
                .price(part.getPrice())
                .costPrice(part.getCostPrice())
                .supplierName(part.getSupplier() != null ? part.getSupplier().getName() : null)
                .createdAt(part.getCreatedAt())
                .build();
    }
}
