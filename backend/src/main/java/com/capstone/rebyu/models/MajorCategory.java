package com.capstone.rebyu.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Set;

@Entity
@Table(name = "major_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MajorCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long majorCategoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Certification certification;

    @Column(nullable = false, length = 150)
    private String title;

    @OneToMany(mappedBy = "majorCategory", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<MiddleCategory> middleCategory;
}
