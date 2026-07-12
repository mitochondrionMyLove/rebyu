package com.capstone.rebyu.bkt.client;

/**
 * Raised when the FastAPI BKT service is unreachable or returns a non-2xx
 * response. The dispatcher treats this as retryable; it never propagates into
 * an assessment submission transaction.
 */
public class BktServiceException extends RuntimeException {

    public BktServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    public BktServiceException(String message) {
        super(message);
    }
}
