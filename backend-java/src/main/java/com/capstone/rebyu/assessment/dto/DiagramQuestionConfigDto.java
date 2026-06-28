package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiagramQuestionConfigDto {
    private Long diagramQuestionConfigId;

    @NotNull
    private Long questionId;

    @NotBlank
    @Size(max = 30)
    private String diagramType;

    private String instructions;

    @NotBlank
    private String expectedOutput;

    @NotBlank
    private String referenceDiagramXml;

    @NotBlank
    private String referenceDiagramJson;
}
