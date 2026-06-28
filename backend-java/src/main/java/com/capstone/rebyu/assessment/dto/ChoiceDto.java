package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChoiceDto {
    private Long choiceId;

    @NotNull
    private Long questionId;

    @NotBlank
    private String choiceText;

    @Size(max = 255)
    private String imageKey;

    private boolean correct;

    private String explanation;

    @NotNull
    @Min(1)
    private Integer displayOrder;
}
