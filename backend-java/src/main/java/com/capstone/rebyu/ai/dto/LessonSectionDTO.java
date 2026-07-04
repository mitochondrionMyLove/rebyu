package com.capstone.rebyu.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonSectionDTO {
    private String id;
    private String sectionName;
    private List<LessonToolDTO> content;
}
