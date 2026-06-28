package com.capstone.rebyu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/certifications/**", "/api/files/**", "/api/lessons/**", "/api/certifications/**", "/api/questions/**", "/api/no-choice-questions/**").permitAll()
                        .anyRequest().authenticated()
                )
                .build();
    }
}