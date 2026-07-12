package com.capstone.rebyu.execution.client;

/**
 * Raised when Judge0 is unreachable or returns a non-2xx response.
 * {@code CodeExecutionService} catches this and reports UNAVAILABLE rather
 * than fabricating a result.
 */
public class Judge0ServiceException extends RuntimeException {

    public Judge0ServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    public Judge0ServiceException(String message) {
        super(message);
    }
}
