package com.gearstock.controller;

import com.gearstock.model.Order;
import com.gearstock.model.Payment;
import com.gearstock.model.Part;
import com.gearstock.repository.OrderRepository;
import com.gearstock.repository.PartRepository;
import com.gearstock.repository.PaymentRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.PrintWriter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
@RequestMapping("/api/reports")
public class ReportExportController {

    private final PartRepository partRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public ReportExportController(PartRepository partRepository, OrderRepository orderRepository, PaymentRepository paymentRepository) {
        this.partRepository = partRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/export")
    public void exportReport(
            @RequestParam(value = "format", defaultValue = "csv") String format,
            @RequestParam(value = "type", defaultValue = "items") String type,
            HttpServletResponse response) {
        try {
            String filename = type + "_report_" + System.currentTimeMillis();

            if ("csv".equalsIgnoreCase(format)) {
                response.setContentType("text/csv");
                response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + ".csv\"");
                generateCsvReport(type, response.getWriter());
            } else if ("excel".equalsIgnoreCase(format) || "xlsx".equalsIgnoreCase(format)) {
                response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + ".xlsx\"");
                generateExcelReport(type, response);
            } else if ("pdf".equalsIgnoreCase(format)) {
                response.setContentType("application/pdf");
                response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + ".pdf\"");
                generatePdfReport(type, response);
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try {
                response.getWriter().write("Error generating export report: " + e.getMessage());
            } catch (Exception ignored) {}
        }
    }

    private void generateCsvReport(String type, PrintWriter writer) {
        if ("items".equalsIgnoreCase(type)) {
            writer.println("SKU,Name,Category,Quantity,Price,CostPrice,Supplier");
            List<Part> parts = partRepository.findAll();
            for (Part p : parts) {
                writer.println(String.format("\"%s\",\"%s\",\"%s\",%d,%s,%s,\"%s\"",
                        p.getSku(), p.getName(),
                        p.getCategory() != null ? p.getCategory().getName() : "N/A",
                        p.getQuantity(), p.getPrice(), p.getCostPrice(),
                        p.getSupplier() != null ? p.getSupplier().getName() : "N/A"));
            }
        } else if ("orders".equalsIgnoreCase(type)) {
            writer.println("OrderNumber,Type,Status,TotalAmount,Customer/Supplier,Date");
            List<Order> orders = orderRepository.findAll();
            for (Order o : orders) {
                String partner = o.getOrderType().equals("SALES")
                        ? (o.getCustomer() != null ? o.getCustomer().getName() : "N/A")
                        : (o.getSupplier() != null ? o.getSupplier().getName() : "N/A");
                writer.println(String.format("\"%s\",\"%s\",\"%s\",%s,\"%s\",\"%s\"",
                        o.getOrderNumber(), o.getOrderType(), o.getStatus(),
                        o.getTotalAmount(), partner, o.getCreatedAt()));
            }
        } else if ("payments".equalsIgnoreCase(type)) {
            writer.println("PaymentID,OrderNumber,Amount,Method,TxnID,Date");
            List<Payment> payments = paymentRepository.findAll();
            for (Payment p : payments) {
                writer.println(String.format("%d,\"%s\",%s,\"%s\",\"%s\",\"%s\"",
                        p.getId(), p.getOrder().getOrderNumber(), p.getAmount(),
                        p.getPaymentMethod(), p.getTransactionId() != null ? p.getTransactionId() : "",
                        p.getPaymentDate()));
            }
        } else {
            // default/statements
            writer.println("Statement - Account Overview");
            writer.println("Metric,Value");
            List<Part> parts = partRepository.findAll();
            BigDecimal inventoryVal = parts.stream()
                    .map(p -> p.getCostPrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            List<Order> orders = orderRepository.findAll();
            BigDecimal salesRevenue = orders.stream()
                    .filter(o -> "SALES".equals(o.getOrderType()) && !"CANCELLED".equals(o.getStatus()))
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal purchaseCost = orders.stream()
                    .filter(o -> "PURCHASE".equals(o.getOrderType()) && !"CANCELLED".equals(o.getStatus()))
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            writer.println(String.format("Total SKUs,%d", parts.size()));
            writer.println(String.format("Inventory Valuation (Cost),%s", inventoryVal));
            writer.println(String.format("Sales Revenue (All-time),%s", salesRevenue));
            writer.println(String.format("Purchasing Spend (All-time),%s", purchaseCost));
            writer.println(String.format("Net Operating Income,%s", salesRevenue.subtract(purchaseCost)));
        }
        writer.flush();
    }

    private void generateExcelReport(String type, HttpServletResponse response) throws Exception {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet(type + "_report");

        if ("items".equalsIgnoreCase(type)) {
            String[] headers = {"SKU", "Name", "Category", "Quantity", "Price", "CostPrice", "Supplier"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
            List<Part> parts = partRepository.findAll();
            int rowIdx = 1;
            for (Part p : parts) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getSku());
                row.createCell(1).setCellValue(p.getName());
                row.createCell(2).setCellValue(p.getCategory() != null ? p.getCategory().getName() : "N/A");
                row.createCell(3).setCellValue(p.getQuantity());
                row.createCell(4).setCellValue(p.getPrice().doubleValue());
                row.createCell(5).setCellValue(p.getCostPrice().doubleValue());
                row.createCell(6).setCellValue(p.getSupplier() != null ? p.getSupplier().getName() : "N/A");
            }
        } else if ("orders".equalsIgnoreCase(type)) {
            String[] headers = {"Order Number", "Type", "Status", "Total Amount", "Customer/Supplier", "Date"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
            List<Order> orders = orderRepository.findAll();
            int rowIdx = 1;
            for (Order o : orders) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(o.getOrderNumber());
                row.createCell(1).setCellValue(o.getOrderType());
                row.createCell(2).setCellValue(o.getStatus());
                row.createCell(3).setCellValue(o.getTotalAmount().doubleValue());
                String partner = o.getOrderType().equals("SALES")
                        ? (o.getCustomer() != null ? o.getCustomer().getName() : "N/A")
                        : (o.getSupplier() != null ? o.getSupplier().getName() : "N/A");
                row.createCell(4).setCellValue(partner);
                row.createCell(5).setCellValue(o.getCreatedAt().toString());
            }
        } else if ("payments".equalsIgnoreCase(type)) {
            String[] headers = {"Payment ID", "Order Number", "Amount", "Method", "Txn ID", "Date"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
            List<Payment> payments = paymentRepository.findAll();
            int rowIdx = 1;
            for (Payment p : payments) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(p.getOrder().getOrderNumber());
                row.createCell(2).setCellValue(p.getAmount().doubleValue());
                row.createCell(3).setCellValue(p.getPaymentMethod());
                row.createCell(4).setCellValue(p.getTransactionId() != null ? p.getTransactionId() : "");
                row.createCell(5).setCellValue(p.getPaymentDate().toString());
            }
        } else {
            // default/statements
            Row r0 = sheet.createRow(0);
            r0.createCell(0).setCellValue("Metric");
            r0.createCell(1).setCellValue("Value");

            List<Part> parts = partRepository.findAll();
            BigDecimal inventoryVal = parts.stream()
                    .map(p -> p.getCostPrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            List<Order> orders = orderRepository.findAll();
            BigDecimal salesRevenue = orders.stream()
                    .filter(o -> "SALES".equals(o.getOrderType()) && !"CANCELLED".equals(o.getStatus()))
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal purchaseCost = orders.stream()
                    .filter(o -> "PURCHASE".equals(o.getOrderType()) && !"CANCELLED".equals(o.getStatus()))
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Row r1 = sheet.createRow(1);
            r1.createCell(0).setCellValue("Total SKUs");
            r1.createCell(1).setCellValue(parts.size());

            Row r2 = sheet.createRow(2);
            r2.createCell(0).setCellValue("Inventory Valuation (Cost)");
            r2.createCell(1).setCellValue(inventoryVal.doubleValue());

            Row r3 = sheet.createRow(3);
            r3.createCell(0).setCellValue("Sales Revenue (All-time)");
            r3.createCell(1).setCellValue(salesRevenue.doubleValue());

            Row r4 = sheet.createRow(4);
            r4.createCell(0).setCellValue("Purchasing Spend (All-time)");
            r4.createCell(1).setCellValue(purchaseCost.doubleValue());

            Row r5 = sheet.createRow(5);
            r5.createCell(0).setCellValue("Net Operating Income");
            r5.createCell(1).setCellValue(salesRevenue.subtract(purchaseCost).doubleValue());
        }

        workbook.write(response.getOutputStream());
        workbook.close();
    }

    private void generatePdfReport(String type, HttpServletResponse response) throws Exception {
        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
        Font subFont = new Font(Font.HELVETICA, 10, Font.ITALIC);
        
        Paragraph title = new Paragraph("GearStock ERP PRO - " + type.toUpperCase() + " REPORT", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);
        
        Paragraph subtitle = new Paragraph("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), subFont);
        subtitle.setAlignment(Paragraph.ALIGN_CENTER);
        subtitle.setSpacingAfter(20);
        document.add(subtitle);

        if ("items".equalsIgnoreCase(type)) {
            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.addCell("SKU");
            table.addCell("Name");
            table.addCell("Category");
            table.addCell("Qty");
            table.addCell("Price");
            table.addCell("Cost");
            table.addCell("Supplier");

            List<Part> parts = partRepository.findAll();
            for (Part p : parts) {
                table.addCell(p.getSku());
                table.addCell(p.getName());
                table.addCell(p.getCategory() != null ? p.getCategory().getName() : "N/A");
                table.addCell(String.valueOf(p.getQuantity()));
                table.addCell("Rs." + p.getPrice());
                table.addCell("Rs." + p.getCostPrice());
                table.addCell(p.getSupplier() != null ? p.getSupplier().getName() : "N/A");
            }
            document.add(table);
        } else if ("orders".equalsIgnoreCase(type)) {
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.addCell("Order Number");
            table.addCell("Type");
            table.addCell("Status");
            table.addCell("Total");
            table.addCell("Partner");
            table.addCell("Date");

            List<Order> orders = orderRepository.findAll();
            for (Order o : orders) {
                table.addCell(o.getOrderNumber());
                table.addCell(o.getOrderType());
                table.addCell(o.getStatus());
                table.addCell("Rs." + o.getTotalAmount());
                String partner = o.getOrderType().equals("SALES")
                        ? (o.getCustomer() != null ? o.getCustomer().getName() : "N/A")
                        : (o.getSupplier() != null ? o.getSupplier().getName() : "N/A");
                table.addCell(partner);
                table.addCell(o.getCreatedAt().toString().substring(0, 10));
            }
            document.add(table);
        } else if ("payments".equalsIgnoreCase(type)) {
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.addCell("Payment ID");
            table.addCell("Order No");
            table.addCell("Amount");
            table.addCell("Method");
            table.addCell("Txn ID");
            table.addCell("Date");

            List<Payment> payments = paymentRepository.findAll();
            for (Payment p : payments) {
                table.addCell(String.valueOf(p.getId()));
                table.addCell(p.getOrder().getOrderNumber());
                table.addCell("Rs." + p.getAmount());
                table.addCell(p.getPaymentMethod());
                table.addCell(p.getTransactionId() != null ? p.getTransactionId() : "");
                table.addCell(p.getPaymentDate().toString().substring(0, 10));
            }
            document.add(table);
        } else {
            // default/statements
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(80);
            table.addCell("Financial Metric");
            table.addCell("Value");

            List<Part> parts = partRepository.findAll();
            BigDecimal inventoryVal = parts.stream()
                    .map(p -> p.getCostPrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            List<Order> orders = orderRepository.findAll();
            BigDecimal salesRevenue = orders.stream()
                    .filter(o -> "SALES".equals(o.getOrderType()) && !"CANCELLED".equals(o.getStatus()))
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal purchaseCost = orders.stream()
                    .filter(o -> "PURCHASE".equals(o.getOrderType()) && !"CANCELLED".equals(o.getStatus()))
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            table.addCell("Total SKUs");
            table.addCell(String.valueOf(parts.size()));

            table.addCell("Inventory Valuation (Cost)");
            table.addCell("Rs. " + inventoryVal);

            table.addCell("Sales Revenue (All-time)");
            table.addCell("Rs. " + salesRevenue);

            table.addCell("Purchasing Spend (All-time)");
            table.addCell("Rs. " + purchaseCost);

            table.addCell("Net Operating Income");
            table.addCell("Rs. " + salesRevenue.subtract(purchaseCost));
            
            document.add(table);
        }

        document.close();
    }
}
