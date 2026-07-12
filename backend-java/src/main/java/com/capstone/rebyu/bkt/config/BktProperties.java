package com.capstone.rebyu.bkt.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration for the internal FastAPI BKT service integration. Secrets and
 * URLs come from the environment; nothing is hardcoded.
 */
@ConfigurationProperties(prefix = "bkt")
public class BktProperties {

    /** Master switch. When false, no events are enqueued or dispatched. */
    private boolean enabled = true;

    /** FastAPI base URL including the API prefix, e.g. http://localhost:8000/api/v1/bkt. */
    private String serviceUrl = "http://localhost:8000/api/v1/bkt";

    /** Internal service key sent as X-Service-Key. Empty disables the header. */
    private String apiKey = "";

    private int connectTimeoutMs = 2000;
    private int readTimeoutMs = 5000;

    /** Max events pulled and forwarded per dispatcher tick. */
    private int dispatchBatchSize = 100;

    /** Retries before a row is moved to DEAD_LETTER. */
    private int maxRetries = 8;

    private int retryInitialDelaySeconds = 15;
    private int retryMaxDelaySeconds = 3600;

    /** Partial-credit correctness threshold: isCorrect = awarded/max >= this. */
    private double partialCreditCorrectThreshold = 0.60;

    /** Fallback learn/forget class for unmapped assessment types. */
    private String fallbackAssessmentType = "LESSON_QUIZ";

    /** Fallback guess/slip class for unmapped difficulty levels. */
    private String fallbackDifficulty = "AVERAGE";

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getServiceUrl() {
        return serviceUrl;
    }

    public void setServiceUrl(String serviceUrl) {
        this.serviceUrl = serviceUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public int getConnectTimeoutMs() {
        return connectTimeoutMs;
    }

    public void setConnectTimeoutMs(int connectTimeoutMs) {
        this.connectTimeoutMs = connectTimeoutMs;
    }

    public int getReadTimeoutMs() {
        return readTimeoutMs;
    }

    public void setReadTimeoutMs(int readTimeoutMs) {
        this.readTimeoutMs = readTimeoutMs;
    }

    public int getDispatchBatchSize() {
        return dispatchBatchSize;
    }

    public void setDispatchBatchSize(int dispatchBatchSize) {
        this.dispatchBatchSize = dispatchBatchSize;
    }

    public int getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(int maxRetries) {
        this.maxRetries = maxRetries;
    }

    public int getRetryInitialDelaySeconds() {
        return retryInitialDelaySeconds;
    }

    public void setRetryInitialDelaySeconds(int retryInitialDelaySeconds) {
        this.retryInitialDelaySeconds = retryInitialDelaySeconds;
    }

    public int getRetryMaxDelaySeconds() {
        return retryMaxDelaySeconds;
    }

    public void setRetryMaxDelaySeconds(int retryMaxDelaySeconds) {
        this.retryMaxDelaySeconds = retryMaxDelaySeconds;
    }

    public double getPartialCreditCorrectThreshold() {
        return partialCreditCorrectThreshold;
    }

    public void setPartialCreditCorrectThreshold(double partialCreditCorrectThreshold) {
        this.partialCreditCorrectThreshold = partialCreditCorrectThreshold;
    }

    public String getFallbackAssessmentType() {
        return fallbackAssessmentType;
    }

    public void setFallbackAssessmentType(String fallbackAssessmentType) {
        this.fallbackAssessmentType = fallbackAssessmentType;
    }

    public String getFallbackDifficulty() {
        return fallbackDifficulty;
    }

    public void setFallbackDifficulty(String fallbackDifficulty) {
        this.fallbackDifficulty = fallbackDifficulty;
    }
}
