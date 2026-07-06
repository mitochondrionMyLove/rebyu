package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamDto;
import com.capstone.rebyu.assessment.mapper.ExamMapper;
import com.capstone.rebyu.assessment.entity.Exam;
import com.capstone.rebyu.assessment.entity.ExamQuestion;
import com.capstone.rebyu.assessment.entity.Question;
import com.capstone.rebyu.assessment.repository.ExamQuestionRepository;
import com.capstone.rebyu.assessment.repository.ExamRepository;
import com.capstone.rebyu.common.BusinessRuleException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ExamService {
    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final ExamMapper examMapper;

    public List<ExamDto> getAll() {
        log.debug("Fetching all exams");
        return examRepository.findAll().stream().map(examMapper::toDto).toList();
    }

    public ExamDto getById(Long id) {
        log.debug("Fetching exam id: {}", id);
        return examMapper.toDto(findEntity(id));
    }

    public ExamDto create(ExamDto dto) {
        log.info("Creating new exam");
        Exam entity = examMapper.toEntity(dto);
        entity.setExamId(null);
        if (entity.getStatus() == null) {
            entity.setStatus(Exam.Status.DRAFT);
        }
        entity.setUpdatedAt(LocalDateTime.now());
        ExamDto result = examMapper.toDto(examRepository.save(entity));
        log.info("Exam created with id: {}", result.getExamId());
        return result;
    }

    public ExamDto update(Long id, ExamDto dto) {
        log.info("Updating exam id: {}", id);
        Exam existing = findEntity(id);
        Exam entity = examMapper.toEntity(dto);
        entity.setExamId(id);
        // Lifecycle fields are managed via publish/archive, not the edit form.
        if (entity.getStatus() == null) {
            entity.setStatus(existing.getStatus());
        }
        entity.setPublishedAt(existing.getPublishedAt());
        entity.setUpdatedAt(LocalDateTime.now());
        ExamDto result = examMapper.toDto(examRepository.save(entity));
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
        return examMapper.toDto(examRepository.save(exam));
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
        return examMapper.toDto(examRepository.save(exam));
    }

    private Exam findEntity(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found: " + id));
    }
}
