package com.capstone.rebyu.ai.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(using = GeneratedQuestionDifficultyDeserializer.class)
public enum GeneratedQuestionDifficulty {
    easy,
    average,
    hard
}
