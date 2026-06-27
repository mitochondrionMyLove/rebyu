package com.capstone.rebyu.certification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lesson_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lessonImageId;

    @Column(name = "lesson_id", nullable = false)
    private int lessonId;

    @Column(name = "section_name", nullable = false)
    private String sectionName;

    @Column(name = "tool_id", nullable = false)
    private String toolId;

    @Column(name = "image_key", nullable = false, length = 500)
    private String imageKey;
}
