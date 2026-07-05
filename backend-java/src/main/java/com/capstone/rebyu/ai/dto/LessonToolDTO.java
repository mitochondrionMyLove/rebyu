package com.capstone.rebyu.ai.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonToolDTO {
    private String id;

    @JsonAlias({"toolType", "tool_type"})
    private String type;

    private Map<String, Object> data;







    @JsonAnySetter
    public void putInlineDataField(String key, Object value) {
        if (data == null) {
            data = new LinkedHashMap<>();
        }
        data.putIfAbsent(key, value);
    }
}
