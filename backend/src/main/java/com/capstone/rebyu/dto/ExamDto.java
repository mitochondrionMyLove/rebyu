package com.capstone.rebyu.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamDto {
    private Long examId;

    @NotNull
    private Long certificationId;

    @NotNull
    private Long examTypeId;

    private boolean isGenerated = false;

    @Min(1)
    private Integer duration;

    @NotNull
    @Min(1)
    private Integer total;
}
