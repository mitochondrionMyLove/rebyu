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
@Table(name = "middle_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
public class MiddleCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long middleCategoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_category_id", nullable = false)
    @ToString.Exclude
    private MajorCategory majorCategory;

    @ToString.Include
    @Column(nullable = false, length = 150)
    private String title;

    @OneToMany(mappedBy = "middleCategory", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("lessonId ASC")
    @ToString.Exclude
    private List<Lesson> lessons = new ArrayList<>();
}
