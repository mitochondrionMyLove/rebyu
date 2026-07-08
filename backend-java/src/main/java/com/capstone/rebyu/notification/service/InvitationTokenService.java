package com.capstone.rebyu.notification.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Single source of truth for invitation token handling.
 *
 * Flow:
 * 1. {@link #generateRawToken()} creates a URL-safe raw token (emailed only).
 * 2. {@link #hashToken(String)} computes SHA-256(rawToken) as lowercase hex
 *    (stored in {@code learner_invitations.token_hash}).
 * 3. On acceptance, the incoming raw token is hashed the same way and looked
 *    up with {@code findByTokenHash(hash)} — the raw token is never stored or
 *    compared directly.
 */
@Service
public class InvitationTokenService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int TOKEN_BYTES = 32; // 256 bits of entropy

    /** URL-safe Base64 raw token without padding; safe to place in a link. */
    public String generateRawToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /** SHA-256 of the raw token as lowercase hex (64 chars). */
    public String hashToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Token must not be blank.");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.trim().getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                hex.append(Character.forDigit((b >> 4) & 0xF, 16));
                hex.append(Character.forDigit(b & 0xF, 16));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 is guaranteed present on every JVM.
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }

    /**
     * Short, safe fingerprint (first 8 hex chars of the hash) for diagnostic
     * logging. Never reveals the raw token and cannot be reversed.
     */
    public String fingerprint(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return "<blank>";
        }
        return hashToken(rawToken).substring(0, 8);
    }
}
