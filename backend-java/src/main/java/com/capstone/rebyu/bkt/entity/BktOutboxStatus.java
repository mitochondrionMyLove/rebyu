package com.capstone.rebyu.bkt.entity;

/**
 * Lifecycle of a {@link BktEventOutbox} row.
 *
 * <pre>
 * PENDING ---claim---> PROCESSING ---success---> PROCESSED
 *    ^                      |
 *    |                      +---failure (retries left)---> PENDING (with backoff)
 *    |                      +---failure (retries exhausted)-> DEAD_LETTER
 * </pre>
 *
 * FAILED is a transient marker reserved for administrator-visible failures that
 * are not yet dead-lettered; the dispatcher itself moves rows between PENDING,
 * PROCESSING, PROCESSED, and DEAD_LETTER.
 */
public enum BktOutboxStatus {
    PENDING,
    PROCESSING,
    PROCESSED,
    FAILED,
    DEAD_LETTER
}
