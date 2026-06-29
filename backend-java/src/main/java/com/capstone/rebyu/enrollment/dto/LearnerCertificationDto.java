package com.capstone.rebyu.enrollment.dto;

import com.capstone.rebyu.enrollment.entity.LearnerCertification;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerCertificationDto {
    private Long learnerCertificationId;

    @NotNull
    private Long learnerId;

    @NotNull
    private Long certificationId;

    @NotNull
    private Long orderDetailId;

    @NotNull
    private LocalDateTime enrolledAt;

    private LearnerCertification.Status status = LearnerCertification.Status.active;
}
