package com.gearstock.dto;


public class LowStockAlertDto {

    private String partName;

    private String sku;

    private String category;

    private int remaining;

    public LowStockAlertDto() {
    }

    public LowStockAlertDto(String partName, String sku, String category, int remaining) {
        this.partName = partName;
        this.sku = sku;
        this.category = category;
        this.remaining = remaining;
    }

    public String getPartName() {
        return this.partName;
    }

    public void setPartName(String partName) {
        this.partName = partName;
    }

    public String getSku() {
        return this.sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getRemaining() {
        return this.remaining;
    }

    public void setRemaining(int remaining) {
        this.remaining = remaining;
    }

    public static LowStockAlertDtoBuilder builder() {
        return new LowStockAlertDtoBuilder();
    }

    public static class LowStockAlertDtoBuilder {
        private String partName;
        private String sku;
        private String category;
        private int remaining;

        public LowStockAlertDtoBuilder partName(String partName) {
            this.partName = partName;
            return this;
        }

        public LowStockAlertDtoBuilder sku(String sku) {
            this.sku = sku;
            return this;
        }

        public LowStockAlertDtoBuilder category(String category) {
            this.category = category;
            return this;
        }

        public LowStockAlertDtoBuilder remaining(int remaining) {
            this.remaining = remaining;
            return this;
        }

        public LowStockAlertDto build() {
            return new LowStockAlertDto(this.partName, this.sku, this.category, this.remaining);
        }
    }
}
