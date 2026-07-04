package com.capstone.rebyu.certification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "major_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
public class MajorCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long majorCategoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    @ToString.Exclude
    private Certification certification;

    @ToString.Include
    @Column(nullable = false, length = 150)
    private String title;

    @OneToMany(mappedBy = "majorCategory", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("middleCategoryId ASC")
    @ToString.Exclude
    private List<MiddleCategory> middleCategory = new ArrayList<>();
}
