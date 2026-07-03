package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "diagram_question_configs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagramQuestionConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long diagramQuestionConfigId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false, unique = true)
    private Question question;

    @Column(name = "diagram_type", nullable = false, length = 30)
    private String diagramType;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "reference_diagram_xml", nullable = false, columnDefinition = "TEXT")
    private String referenceDiagramXml;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "reference_diagram_json", nullable = false, columnDefinition = "JSONB")
    private String referenceDiagramJson;
}
