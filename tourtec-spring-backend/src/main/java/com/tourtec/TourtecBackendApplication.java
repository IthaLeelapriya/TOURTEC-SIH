package com.tourtec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TourtecBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TourtecBackendApplication.class, args);
        System.out.println("\n========================================================");
        System.out.println("🚀 TOURTEC INDIA Spring Boot Backend running on http://localhost:5000");
        System.out.println("========================================================\n");
    }
}
