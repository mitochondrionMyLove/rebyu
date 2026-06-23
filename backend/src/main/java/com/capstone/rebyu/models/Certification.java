package com.capstone.rebyu.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "certifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long certificationId;

    @Column(nullable = false, unique = true, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_key", length = 255)
    private String imageKey;

    @Column(name = "date_created", nullable = false)
    private LocalDateTime dateCreated;

    @Column(nullable = false)
    private BigDecimal price = BigDecimal.ZERO;

    @OneToMany(mappedBy = "certification", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<MajorCategory> majorCategory;


}
