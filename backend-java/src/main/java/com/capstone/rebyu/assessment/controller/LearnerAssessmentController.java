package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.attempt.DiagramAttemptDtos.*;
import com.capstone.rebyu.assessment.dto.attempt.LearnerAttemptDtos.*;
import com.capstone.rebyu.assessment.dto.attempt.ProgrammingAttemptDtos.*;
import com.capstone.rebyu.assessment.service.AssessmentAttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PutMapping("/assessment-attempts/{attemptId}/flags/{attemptQuestionId}")
    public void setFlag(
            @PathVariable Long attemptId,
            @PathVariable Long attemptQuestionId,
            @Valid @RequestBody FlagRequestDto request) {
        assessmentAttemptService.setFlag(
                attemptId, attemptQuestionId, request.learnerId(), request.flagged());
    }

    @PutMapping("/assessment-attempts/{attemptId}/skip/{attemptQuestionId}")
    public void setSkip(
            @PathVariable Long attemptId,
            @PathVariable Long attemptQuestionId,
            @Valid @RequestBody SkipRequestDto request) {
        assessmentAttemptService.setSkip(
                attemptId, attemptQuestionId, request.learnerId(), request.skipped());
    }

    @PutMapping("/assessment-attempts/{attemptId}/current-item")
    public void setCurrentItem(
            @PathVariable Long attemptId,
            @Valid @RequestBody CurrentItemRequestDto request) {
        assessmentAttemptService.setCurrentItem(
                attemptId, request.attemptQuestionId(), request.learnerId());
    }

    @PostMapping("/assessment-attempts/{attemptId}/programming/{attemptQuestionId}/run")
    public ExecutionResultDto runProgramming(
            @PathVariable Long attemptId,
            @PathVariable Long attemptQuestionId,
            @Valid @RequestBody ProgrammingRunRequestDto request) {
        return assessmentAttemptService.runProgramming(attemptId, attemptQuestionId, request);
    }

    @PostMapping("/assessment-attempts/{attemptId}/programming/{attemptQuestionId}/check")
    public ExecutionResultDto checkProgramming(
            @PathVariable Long attemptId,
            @PathVariable Long attemptQuestionId,
            @Valid @RequestBody ProgrammingRunRequestDto request) {
        return assessmentAttemptService.checkProgramming(attemptId, attemptQuestionId, request);
    }

    @GetMapping("/assessment-attempts/{attemptId}/programming/{attemptQuestionId}/executions")
    public List<ExecutionHistoryItemDto> listExecutions(
            @PathVariable Long attemptId,
            @PathVariable Long attemptQuestionId,
            @RequestParam Long learnerId) {
        return assessmentAttemptService.listExecutions(attemptId, attemptQuestionId, learnerId);
    }

    @PostMapping("/assessment-attempts/{attemptId}/diagram/{attemptQuestionId}/check")
    public DiagramCheckResultDto checkDiagram(
            @PathVariable Long attemptId,
            @PathVariable Long attemptQuestionId,
            @Valid @RequestBody DiagramCheckRequestDto request) {
        return assessmentAttemptService.checkDiagram(attemptId, attemptQuestionId, request);
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

    @GetMapping("/assessments/{assessmentId}/attempts")
    public List<AttemptSummaryDto> listAttemptsForAssessment(
            @PathVariable Long assessmentId,
            @RequestParam Long learnerId) {
        return assessmentAttemptService.listAttemptsForAssessment(assessmentId, learnerId);
    }

    @GetMapping("/assessment-attempts/{attemptId}/result")
    public AssessmentAttemptResultDto getResult(
            @PathVariable Long attemptId,
            @RequestParam Long learnerId) {
        return assessmentAttemptService.getResult(attemptId, learnerId);
    }
}
