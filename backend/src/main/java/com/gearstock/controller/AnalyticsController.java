package com.gearstock.controller;

import com.gearstock.dto.ItemSalesDto;
import com.gearstock.repository.OrderItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final OrderItemRepository orderItemRepository;

    public AnalyticsController(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    @GetMapping("/item-sales")
    public ResponseEntity<List<ItemSalesDto>> getItemSales(@RequestParam(value = "period", defaultValue = "month") String period) {
        LocalDateTime since = null;
        LocalDateTime now = LocalDateTime.now();

        switch (period.toLowerCase()) {
            case "day":
                since = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
                break;
            case "week":
                since = now.minusWeeks(1);
                break;
            case "month":
                since = now.minusMonths(1);
                break;
            case "year":
                since = now.minusYears(1);
                break;
            case "total":
            default:
                since = null;
                break;
        }

        List<Object[]> rawData;
        if (since == null) {
            rawData = orderItemRepository.getItemsSoldAllTime();
        } else {
            rawData = orderItemRepository.getItemsSoldSince(since);
        }

        List<ItemSalesDto> result = new ArrayList<>();
        for (Object[] row : rawData) {
            String sku = (String) row[0];
            String name = (String) row[1];
            Long qty = ((Number) row[2]).longValue();
            BigDecimal rev = row[3] instanceof BigDecimal ? (BigDecimal) row[3] : BigDecimal.valueOf(((Number) row[3]).doubleValue());
            result.add(new ItemSalesDto(sku, name, qty, rev));
        }

        return ResponseEntity.ok(result);
    }
}
