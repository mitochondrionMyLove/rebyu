package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "learner_diagram_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerDiagramAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long learnerDiagramAnswerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_exam_detail_id", nullable = false, unique = true)
    private LearnerExamDetail learnerExamDetail;

    @Column(name = "diagram_xml", nullable = false, columnDefinition = "TEXT")
    private String diagramXml;

    @Column(name = "diagram_json", nullable = false, columnDefinition = "JSONB")
    private String diagramJson;
}
