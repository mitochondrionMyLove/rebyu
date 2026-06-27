package com.capstone.rebyu.progress.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityTypeDto {
    private Long activityTypeId;
    @NotBlank
    @Size(max = 50)
    private String activityTypeText;
}