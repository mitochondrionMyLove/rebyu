package com.capstone.rebyu.certification.entity;


import com.capstone.rebyu.certification.entity.Lesson;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Set;

@Entity
@Table(name = "middle_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MiddleCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long middleCategoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_category_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private MajorCategory majorCategory;

    @Column(nullable = false, length = 150)
    private String title;

    @OneToMany(mappedBy = "middleCategory", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Lesson> lessons;
}
