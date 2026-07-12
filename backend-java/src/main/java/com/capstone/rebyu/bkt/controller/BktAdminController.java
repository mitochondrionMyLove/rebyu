package com.capstone.rebyu.bkt.controller;

import com.capstone.rebyu.bkt.dto.BktOutboxAdminView;
import com.capstone.rebyu.bkt.dto.BktReconciliationSummary;
import com.capstone.rebyu.bkt.entity.BktOutboxStatus;
import com.capstone.rebyu.bkt.service.BktAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Admin operations for the BKT outbox and reconciliation. Intended for the ADMIN
 * role; access follows the application's existing security configuration.
 */
@RestController
@RequestMapping("/api/admin/bkt")
@RequiredArgsConstructor
public class BktAdminController {

    private final BktAdminService adminService;

    @GetMapping("/outbox/stats")
    public Map<String, Long> outboxStats() {
        return adminService.outboxStats();
    }

    @GetMapping("/outbox/dead-letter")
    public List<BktOutboxAdminView> deadLetter(
            @RequestParam(defaultValue = "100") int limit) {
        return adminService.deadLetter(limit);
    }

    @GetMapping("/outbox")
    public List<BktOutboxAdminView> byStatus(
            @RequestParam(defaultValue = "FAILED") BktOutboxStatus status,
            @RequestParam(defaultValue = "100") int limit) {
        return adminService.byStatus(status, limit);
    }

    @PostMapping("/outbox/{id}/retry")
    public Map<String, Object> retry(@PathVariable Long id) {
        return Map.of("retried", adminService.retry(id));
    }

    @PostMapping("/outbox/dead-letter/retry")
    public Map<String, Object> retryDeadLetter(
            @RequestParam(defaultValue = "100") int limit) {
        return Map.of("retried", adminService.retryDeadLetter(limit));
    }

    @PostMapping("/reconcile")
    public BktReconciliationSummary reconcile(
            @RequestParam(defaultValue = "200") int limit) {
        return adminService.reconcile(limit);
    }
}
