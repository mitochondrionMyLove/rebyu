package com.capstone.rebyu.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDto {
    private Long logId;

    @NotNull
    private Long userId;

    @NotNull
    private Long activityTypeId;

    @NotNull
    private LocalDateTime dateTime;

    @Min(0)
    private Integer duration; // seconds
}