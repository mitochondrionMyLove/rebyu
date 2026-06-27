package com.capstone.rebyu.certification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lesson_videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lessonVideoId;

    @Column(name = "lesson_id", nullable = false)
    private int lessonId;

    @Column(name = "section_name", nullable = false)
    private String sectionName;

    @Column(name = "tool_id", nullable = false)
    private String toolId;

    @Column(name = "video_key", nullable = false, length = 500)
    private String videoKey;
}
