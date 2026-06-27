package com.capstone.rebyu.challenge.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeSessionDto {
    private Long challengeSessionId;
    @NotNull
    private Long challengeModeId;
    @NotNull
    private Long learnerId;
    @NotNull
    private LocalDateTime startedTime;
    private LocalDateTime endedTime;
    @Min(0)
    private Integer score;
    private String status; // PASSED or FAILED
}