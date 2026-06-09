package com.gearstock.dto;


public class CategoryDistributionDto {

    private String name;

    private long value;

    private String color;

    public CategoryDistributionDto() {
    }

    public CategoryDistributionDto(String name, long value, String color) {
        this.name = name;
        this.value = value;
        this.color = color;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getValue() {
        return this.value;
    }

    public void setValue(long value) {
        this.value = value;
    }

    public String getColor() {
        return this.color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public static CategoryDistributionDtoBuilder builder() {
        return new CategoryDistributionDtoBuilder();
    }

    public static class CategoryDistributionDtoBuilder {
        private String name;
        private long value;
        private String color;

        public CategoryDistributionDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CategoryDistributionDtoBuilder value(long value) {
            this.value = value;
            return this;
        }

        public CategoryDistributionDtoBuilder color(String color) {
            this.color = color;
            return this;
        }

        public CategoryDistributionDto build() {
            return new CategoryDistributionDto(this.name, this.value, this.color);
        }
    }
}
