package com.capstone.rebyu.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "enterprises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enterprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enterpriseId;

    @Column(name = "enterprise_name", nullable = false, unique = true, length = 100)
    private String enterpriseName;

    @Column(nullable = false, length = 100)
    private String industry;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;
}
