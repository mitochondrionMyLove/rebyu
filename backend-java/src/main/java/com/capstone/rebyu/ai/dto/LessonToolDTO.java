package com.capstone.rebyu.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonToolDTO {
    private String id;
    private String type;
    private Map<String, Object> data;
}
