package com.capstone.rebyu.ai.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LessonSectionDTO {
    private String id;

    @JsonAlias({"section_name", "title", "name"})
    private String sectionName;


    @JsonAlias({"tools", "components", "blocks", "items"})
    private List<LessonToolDTO> content;
}
