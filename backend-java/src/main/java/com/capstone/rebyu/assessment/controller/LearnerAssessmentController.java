package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.attempt.LearnerAttemptDtos.*;
import com.capstone.rebyu.assessment.service.AssessmentAttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Learner-safe assessment endpoints. Responses never contain answer keys,
 * rubrics, or reference diagram data before submission.
 */
@RestController
@RequestMapping("/api/learner")
@RequiredArgsConstructor
public class LearnerAssessmentController {

    private final AssessmentAttemptService assessmentAttemptService;

    @GetMapping("/assessments/{assessmentId}")
    public LearnerAssessmentDto getAssessment(
            @PathVariable Long assessmentId,
            @RequestParam Long learnerId) {
        return assessmentAttemptService.getLearnerAssessment(assessmentId, learnerId);
    }

    @PostMapping("/assessments/{assessmentId}/attempts")
    @ResponseStatus(HttpStatus.CREATED)
    public AssessmentAttemptStartResponseDto startAttempt(
            @PathVariable Long assessmentId,
            @Valid @RequestBody AssessmentAttemptStartRequestDto request) {
        return assessmentAttemptService.startAttempt(
                assessmentId, request.learnerId(), request.idempotencyKey());
    }

    @PutMapping("/assessment-attempts/{attemptId}/answers")
    public void autosaveAnswers(
            @PathVariable Long attemptId,
            @Valid @RequestBody AutosaveAnswersRequestDto request) {
        assessmentAttemptService.autosaveAnswers(attemptId, request);
    }

    @PostMapping("/assessment-attempts/{attemptId}/submit")
    public AssessmentAttemptResultDto submitAttempt(
            @PathVariable Long attemptId,
            @Valid @RequestBody SubmitAssessmentAttemptRequestDto request) {
        return assessmentAttemptService.submitAttempt(attemptId, request);
    }

    @GetMapping("/assessment-attempts")
    public java.util.List<java.util.Map<String, Object>> listAttempts(
            @RequestParam Long learnerId) {
        return assessmentAttemptService.listAttempts(learnerId);
    }

    @GetMapping("/assessment-attempts/{attemptId}/result")
    public AssessmentAttemptResultDto getResult(
            @PathVariable Long attemptId,
            @RequestParam Long learnerId) {
        return assessmentAttemptService.getResult(attemptId, learnerId);
    }
}
