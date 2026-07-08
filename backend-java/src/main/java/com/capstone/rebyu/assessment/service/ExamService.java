package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamDto;
import com.capstone.rebyu.assessment.mapper.ExamMapper;
import com.capstone.rebyu.assessment.entity.Exam;
import com.capstone.rebyu.assessment.entity.ExamQuestion;
import com.capstone.rebyu.assessment.entity.Question;
import com.capstone.rebyu.assessment.repository.ExamQuestionRepository;
import com.capstone.rebyu.assessment.repository.ExamRepository;
import com.capstone.rebyu.assessment.repository.QuestionRepository;
import com.capstone.rebyu.common.BusinessRuleException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ExamService {
    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final QuestionRepository questionRepository;
    private final ExamMapper examMapper;

    public List<ExamDto> getAll() {
        log.debug("Fetching all exams");
        return examRepository.findAll().stream().map(this::toDtoWithQuestions).toList();
    }

    public ExamDto getById(Long id) {
        log.debug("Fetching exam id: {}", id);
        return toDtoWithQuestions(findEntity(id));
    }

    public ExamDto create(ExamDto dto) {
        log.info("Creating new exam");
        Exam entity = examMapper.toEntity(dto);
        entity.setExamId(null);
        normalizeForSave(entity, dto);
        if (entity.getStatus() == null) {
            entity.setStatus(Exam.Status.DRAFT);
        }
        entity.setUpdatedAt(LocalDateTime.now());
        Exam saved = examRepository.save(entity);
        if (dto.getQuestionIds() != null) {
            syncExamQuestions(saved, dto.getQuestionIds());
            saved.setTotalQuestions(dto.getQuestionIds().size());
            saved = examRepository.save(saved);
        }
        ExamDto result = toDtoWithQuestions(saved);
        log.info("Exam created with id: {}", result.getExamId());
        return result;
    }

    public ExamDto update(Long id, ExamDto dto) {
        log.info("Updating exam id: {}", id);
        Exam existing = findEntity(id);
        Exam entity = examMapper.toEntity(dto);
        entity.setExamId(id);
        normalizeForSave(entity, dto);
        // Lifecycle fields are managed via publish/archive, not the edit form.
        if (entity.getStatus() == null) {
            entity.setStatus(existing.getStatus());
        }
        entity.setPublishedAt(existing.getPublishedAt());
        entity.setUpdatedAt(LocalDateTime.now());
        Exam saved = examRepository.save(entity);
        if (dto.getQuestionIds() != null) {
            syncExamQuestions(saved, dto.getQuestionIds());
            saved.setTotalQuestions(dto.getQuestionIds().size());
            saved = examRepository.save(saved);
        }
        ExamDto result = toDtoWithQuestions(saved);
        log.info("Exam id: {} updated", id);
        return result;
    }

    public ExamDto publish(Long id) {
        Exam exam = findEntity(id);

        if (exam.getTitle() == null || exam.getTitle().isBlank()) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "The assessment needs a title before it can be published.");
        }

        List<ExamQuestion> examQuestions =
                examQuestionRepository.findByExam_ExamIdOrderByDisplayOrderAsc(id);
        if (examQuestions.isEmpty()) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "Add at least one question before publishing this assessment.");
        }

        Long certificationId = exam.getCertification().getCertificationId();
        for (ExamQuestion examQuestion : examQuestions) {
            Question question = examQuestion.getQuestion();
            Long questionCertId = question.getLesson()
                    .getMiddleCategory().getMajorCategory()
                    .getCertification().getCertificationId();
            if (!certificationId.equals(questionCertId)) {
                throw new BusinessRuleException.QuestionNotEligibleForAssessmentException();
            }
            if (exam.getLesson() != null
                    && !exam.getLesson().getLessonId()
                            .equals(question.getLesson().getLessonId())) {
                throw new BusinessRuleException.QuestionNotEligibleForAssessmentException();
            }
        }

        exam.setStatus(Exam.Status.PUBLISHED);
        exam.setPublishedAt(LocalDateTime.now());
        exam.setUpdatedAt(LocalDateTime.now());
        log.info("Exam id: {} published with {} question(s)", id, examQuestions.size());
        return toDtoWithQuestions(examRepository.save(exam));
    }

    public void delete(Long id) {
        log.info("Deleting exam id: {}", id);
        examRepository.delete(findEntity(id));
        log.info("Exam id: {} deleted", id);
    }

    public ExamDto archive(Long id) {
        Exam exam = findEntity(id);
        exam.setStatus(Exam.Status.ARCHIVED);
        exam.setUpdatedAt(LocalDateTime.now());
        log.info("Exam id: {} archived", id);
        return toDtoWithQuestions(examRepository.save(exam));
    }

    private Exam findEntity(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found: " + id));
    }

    private ExamDto toDtoWithQuestions(Exam exam) {
        ExamDto dto = examMapper.toDto(exam);
        List<Long> questionIds = examQuestionRepository
                .findByExam_ExamIdOrderByDisplayOrderAsc(exam.getExamId())
                .stream()
                .map(examQuestion -> examQuestion.getQuestion().getQuestionId())
                .toList();
        dto.setQuestionIds(questionIds);
        return dto;
    }

    private void normalizeForSave(Exam entity, ExamDto dto) {
        if (dto.getQuestionIds() != null) {
            entity.setTotalQuestions(dto.getQuestionIds().size());
        } else if (entity.getTotalQuestions() == null) {
            entity.setTotalQuestions(0);
        }

        if (entity.getPassingScore() == null) {
            entity.setPassingScore(new BigDecimal("70.00"));
        }
    }

    private void syncExamQuestions(Exam exam, List<Long> questionIds) {
        List<Long> orderedQuestionIds = new ArrayList<>(questionIds);
        Set<Long> uniqueQuestionIds = new LinkedHashSet<>(orderedQuestionIds);
        if (uniqueQuestionIds.size() != orderedQuestionIds.size()) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "The same question cannot be added to an assessment more than once.");
        }

        Long certificationId = exam.getCertification().getCertificationId();
        Long lessonId = exam.getLesson() == null ? null : exam.getLesson().getLessonId();

        List<Question> questions = questionRepository.findAllById(orderedQuestionIds);
        if (questions.size() != orderedQuestionIds.size()) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "One or more selected questions no longer exist.");
        }

        for (Question question : questions) {
            Long questionCertId = question.getLesson()
                    .getMiddleCategory().getMajorCategory()
                    .getCertification().getCertificationId();
            if (!certificationId.equals(questionCertId)) {
                throw new BusinessRuleException.QuestionNotEligibleForAssessmentException();
            }
            if (lessonId != null && !lessonId.equals(question.getLesson().getLessonId())) {
                throw new BusinessRuleException.QuestionNotEligibleForAssessmentException();
            }
        }

        examQuestionRepository.deleteByExam_ExamId(exam.getExamId());
        int displayOrder = 1;
        for (Long questionId : orderedQuestionIds) {
            Question question = questions.stream()
                    .filter(candidate -> candidate.getQuestionId().equals(questionId))
                    .findFirst()
                    .orElseThrow();
            examQuestionRepository.save(ExamQuestion.builder()
                    .exam(exam)
                    .question(question)
                    .displayOrder(displayOrder++)
                    .build());
        }
    }
}
