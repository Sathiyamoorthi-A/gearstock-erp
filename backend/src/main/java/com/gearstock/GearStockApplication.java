package com.gearstock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;

@SpringBootApplication
public class GearStockApplication {

    // Fix: Windows reports 'Asia/Calcutta' (deprecated) but PostgreSQL only
    // accepts 'Asia/Kolkata'. Force the correct IANA timezone before DB connects.
    static {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    }

    public static void main(String[] args) {
        SpringApplication.run(GearStockApplication.class, args);
    }
}
