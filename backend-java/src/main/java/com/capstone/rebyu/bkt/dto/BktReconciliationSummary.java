package com.capstone.rebyu.bkt.dto;

import java.time.LocalDateTime;

/** Result of a reconciliation run over finalized attempts. */
public record BktReconciliationSummary(
        int attemptsScanned,
        int eventsCreated,
        LocalDateTime completedAt
) {
}
