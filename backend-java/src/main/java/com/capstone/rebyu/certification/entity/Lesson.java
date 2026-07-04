package com.capstone.rebyu.certification.entity;


import com.capstone.rebyu.assessment.entity.Question;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long lessonId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "middle_category_id", nullable = false)
    @ToString.Exclude
    private MiddleCategory middleCategory;

    @ToString.Include
    @Column(nullable = false, length = 150)
    private String name;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "lesson_component_structure", nullable = false)
    private String lessonComponentStructure = "[]";

    @OneToMany(
            mappedBy = "lesson",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Question> questionSet = new ArrayList<>();

}
