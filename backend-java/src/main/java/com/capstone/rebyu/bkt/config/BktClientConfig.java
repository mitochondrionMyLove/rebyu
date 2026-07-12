package com.capstone.rebyu.bkt.config;

import io.netty.channel.ChannelOption;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

/**
 * Wires the internal WebClient used to reach the FastAPI BKT service and turns
 * on scheduling for the outbox dispatcher.
 */
@Configuration
@EnableScheduling
@EnableConfigurationProperties(BktProperties.class)
public class BktClientConfig {

    @Bean("bktWebClient")
    public WebClient bktWebClient(BktProperties properties) {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, properties.getConnectTimeoutMs())
                .responseTimeout(Duration.ofMillis(properties.getReadTimeoutMs()));

        WebClient.Builder builder = WebClient.builder()
                .baseUrl(properties.getServiceUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json");

        if (properties.getApiKey() != null && !properties.getApiKey().isBlank()) {
            builder.defaultHeader("X-Service-Key", properties.getApiKey());
        }
        return builder.build();
    }
}
