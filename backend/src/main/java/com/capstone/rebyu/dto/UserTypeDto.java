package com.capstone.rebyu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTypeDto {
    private Long userTypeId;

    @NotBlank
    @Pattern(regexp = "learner|enterprise|admin")
    private String userTypeText;
}
