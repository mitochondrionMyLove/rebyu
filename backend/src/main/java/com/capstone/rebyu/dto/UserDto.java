package com.capstone.rebyu.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long userId;
    @NotBlank
    @Email
    @Size(max = 100)
    private String email;
    @Size(max = 100)
    private String phoneNumber;
    private Long userTypeId;
}