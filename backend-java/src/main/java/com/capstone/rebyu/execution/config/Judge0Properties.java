package com.capstone.rebyu.execution.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration for the Judge0 code-execution integration. Defaults to the
 * free, keyless public Judge0 CE instance — {@code apiKey} stays empty
 * unless a self-hosted or RapidAPI instance is configured instead.
 */
@ConfigurationProperties(prefix = "judge0")
public class Judge0Properties {

    /** Master switch. When false, Run/Check never call out to Judge0. */
    private boolean enabled = true;

    /** Judge0 REST base URL, e.g. https://ce.judge0.com. */
    private String baseUrl = "https://ce.judge0.com";

    /** Optional RapidAPI/self-hosted key; empty uses the endpoint keylessly. */
    private String apiKey = "";

    /** Optional key header name (RapidAPI uses X-RapidAPI-Key). */
    private String apiKeyHeader = "X-RapidAPI-Key";

    private int connectTimeoutMs = 5000;

    /** Long enough to cover Judge0's own per-submission CPU time limit. */
    private int readTimeoutMs = 20000;

    /** Wall-clock seconds Judge0 allows per submission before killing it. */
    private int cpuTimeLimitSeconds = 5;

    private int memoryLimitKb = 128000;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getApiKeyHeader() {
        return apiKeyHeader;
    }

    public void setApiKeyHeader(String apiKeyHeader) {
        this.apiKeyHeader = apiKeyHeader;
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

    public int getCpuTimeLimitSeconds() {
        return cpuTimeLimitSeconds;
    }

    public void setCpuTimeLimitSeconds(int cpuTimeLimitSeconds) {
        this.cpuTimeLimitSeconds = cpuTimeLimitSeconds;
    }

    public int getMemoryLimitKb() {
        return memoryLimitKb;
    }

    public void setMemoryLimitKb(int memoryLimitKb) {
        this.memoryLimitKb = memoryLimitKb;
    }
}
