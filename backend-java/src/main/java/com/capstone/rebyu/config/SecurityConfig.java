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
                        // Certification & content
                        .requestMatchers("/api/certifications/**").permitAll()
                        .requestMatchers("/api/files/**").permitAll()
                        .requestMatchers("/api/lessons/**").permitAll()

                        // Question bank — core question types
                        .requestMatchers("/api/questions/**").permitAll()
                        .requestMatchers("/api/choices/**").permitAll()
                        .requestMatchers("/api/text-question-configs/**").permitAll()
                        .requestMatchers("/api/diagram-question-configs/**").permitAll()
                        .requestMatchers("/api/programming-question-configs/**").permitAll()
                        .requestMatchers("/api/programming-test-cases/**").permitAll()

                        // Exam management
                        .requestMatchers("/api/exams/**").permitAll()
                        .requestMatchers("/api/exam-types/**").permitAll()
                        .requestMatchers("/api/exam-questions/**").permitAll()
                        .requestMatchers("/api/exam-choices/**").permitAll()
                        .requestMatchers("/api/exam-results/**").permitAll()

                        // Learner answers
                        .requestMatchers("/api/learner-exam-details/**").permitAll()
                        .requestMatchers("/api/learner-mcq-answers/**").permitAll()
                        .requestMatchers("/api/learner-text-answers/**").permitAll()
                        .requestMatchers("/api/learner-diagram-answers/**").permitAll()
                        .requestMatchers("/api/learner-programming-answers/**").permitAll()

                        // AI assistant & document RAG
                        .requestMatchers("/api/ai/**").permitAll()

                        .anyRequest().authenticated()
                )
                .build();
    }
}
