package com.techstore.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class EnvironmentDebugger {

    @Bean
    public CommandLineRunner debugEnvironment(Environment env) {
        return args -> {
            System.out.println("=================================");
            System.out.println("ENVIRONMENT DEBUG");
            System.out.println("=================================");
            System.out.println("Active Profiles: " + String.join(", ", env.getActiveProfiles()));
            System.out.println("DATABASE_URL from env: " + System.getenv("DATABASE_URL"));
            System.out.println("spring.datasource.url: " + env.getProperty("spring.datasource.url"));
            System.out.println("SPRING_PROFILES_ACTIVE from env: " + System.getenv("SPRING_PROFILES_ACTIVE"));
            System.out.println("=================================");
        };
    }
}
