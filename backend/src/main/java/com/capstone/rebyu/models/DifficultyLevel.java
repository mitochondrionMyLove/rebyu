package com.capstone.rebyu.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "difficulty_levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DifficultyLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long difficultyLevelId;

    @Column(name = "difficulty_level_text", nullable = false, unique = true, length = 20)
    private String difficultyLevelText;
}
