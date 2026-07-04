package com.capstone.rebyu.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AILessonStructureDTO {
    private List<LessonSectionDTO> sections;
}
