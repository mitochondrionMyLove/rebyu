package com.capstone.rebyu.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "middle_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MiddleCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long middleCategoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_category_id", nullable = false)
    private MajorCategory majorCategory;

    @Column(nullable = false, length = 150)
    private String title;

    @OneToMany(mappedBy = "middleCategory", fetch = FetchType.LAZY)
    private Set<Lesson> lessons;
}
