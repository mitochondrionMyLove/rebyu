package com.capstone.rebyu.bkt.controller;

import com.capstone.rebyu.bkt.dto.LearnerMasteryView;
import com.capstone.rebyu.bkt.service.LearnerMasteryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Learner-facing BKT analytics. The browser calls Spring Boot only; Spring Boot
 * calls the internal FastAPI BKT service. FastAPI is never exposed to learners.
 *
 * <p>Follows the existing learner-controller convention of accepting the learner
 * id as a request parameter; hardening to the authenticated principal is a
 * separate, app-wide change.
 */
@RestController
@RequestMapping("/api/learner/analytics")
@RequiredArgsConstructor
public class LearnerAnalyticsController {

    private final LearnerMasteryService learnerMasteryService;

    /** All lesson mastery for a learner, optionally filtered to specific lessons. */
    @GetMapping("/mastery")
    public LearnerMasteryView getMastery(
            @RequestParam Long learnerId,
            @RequestParam(name = "lessonId", required = false) List<Long> lessonIds) {
        return learnerMasteryService.getMastery(learnerId, lessonIds);
    }

    /** Weighted certification readiness. Proxies the FastAPI readiness endpoint. */
    @PostMapping("/readiness")
    public Map<String, Object> getReadiness(@RequestBody Map<String, Object> request) {
        return learnerMasteryService.getReadiness(request);
    }

    /** Lesson → middle → major priority hierarchy for a certification. */
    @GetMapping("/priorities/certifications/{certificationId}")
    public Map<String, Object> getPriorities(
            @PathVariable Long certificationId,
            @RequestParam Long learnerId) {
        return learnerMasteryService.getPriorities(learnerId, certificationId);
    }

    /** Certification confidence summary. */
    @GetMapping("/confidence/certifications/{certificationId}")
    public Map<String, Object> getConfidence(
            @PathVariable Long certificationId,
            @RequestParam Long learnerId) {
        return learnerMasteryService.getConfidence(learnerId, certificationId);
    }
}
