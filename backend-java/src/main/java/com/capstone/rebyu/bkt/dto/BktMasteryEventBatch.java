package com.capstone.rebyu.bkt.dto;

import java.util.List;

/** Request body for {@code POST /mastery/events/batch}. */
public record BktMasteryEventBatch(List<BktMasteryEvent> events) {
}
