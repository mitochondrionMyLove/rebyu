package com.capstone.rebyu.certification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonComponentResponseDto {

    private String lessonComponentStructure;
    private Map<String, String> imageKeys;
    private Map<String, String> videoKeys;
}