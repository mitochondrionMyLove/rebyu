package com.capstone.rebyu.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exam_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long examTypeId;

    @Column(name = "exam_type_text", nullable = false, unique = true, length = 50)
    private String examTypeText;
}
