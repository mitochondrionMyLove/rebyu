package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.attempt.LearnerAttemptDtos.*;
import com.capstone.rebyu.assessment.entity.*;
import com.capstone.rebyu.assessment.repository.*;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.enrollment.entity.LearnerCertification;
import com.capstone.rebyu.enrollment.repository.LearnerCertificationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentAttemptServiceTest {

    @Mock private ExamRepository examRepository;
    @Mock private ExamQuestionRepository examQuestionRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private TextQuestionConfigRepository textQuestionConfigRepository;
    @Mock private ProgrammingQuestionConfigRepository programmingQuestionConfigRepository;
    @Mock private DiagramQuestionConfigRepository diagramQuestionConfigRepository;
    @Mock private AssessmentAttemptRepository attemptRepository;
    @Mock private AssessmentAttemptQuestionRepository attemptQuestionRepository;
    @Mock private AssessmentAttemptAnswerRepository attemptAnswerRepository;
    @Mock private LearnerCertificationRepository learnerCertificationRepository;
    @Mock private ExamResultRepository examResultRepository;

    private AssessmentAttemptService service;

    private Exam exam;
    private Question mcqQuestion;

    @BeforeEach
    void setUp() {
        service = new AssessmentAttemptService(
                examRepository, examQuestionRepository, questionRepository,
                textQuestionConfigRepository, programmingQuestionConfigRepository,
                diagramQuestionConfigRepository, attemptRepository,
                attemptQuestionRepository, attemptAnswerRepository,
                learnerCertificationRepository, examResultRepository,
                new ObjectMapper());

        Certification certification = new Certification();
        certification.setCertificationId(1L);

        ExamType type = new ExamType();
        type.setExamTypeId(1L);
        type.setExamTypeText("MOCK_EXAM");

        exam = Exam.builder()
                .examId(5L)
                .certification(certification)
                .examType(type)
                .title("Mock Exam 1")
                .totalQuestions(1)
                .passingScore(new BigDecimal("50"))
                .status(Exam.Status.PUBLISHED)
                .build()
        ;

        Lesson lesson = new Lesson();
        lesson.setLessonId(7L);

        mcqQuestion = new Question();
        mcqQuestion.setQuestionId(100L);
        mcqQuestion.setQuestionType("MULTIPLE_CHOICE");
        mcqQuestion.setDifficultyLevel("EASY");
        mcqQuestion.setQuestionText("What does PDCA stand for?");
        mcqQuestion.setLesson(lesson);
        mcqQuestion.setTotalPoints(BigDecimal.ONE);
        Choice correct = new Choice();
        correct.setChoiceId(1000L);
        correct.setChoiceText("Plan Do Check Act");
        correct.setCorrect(true);
        Choice wrong = new Choice();
        wrong.setChoiceId(1001L);
        wrong.setChoiceText("Plan Design Create Analyze");
        wrong.setCorrect(false);
        mcqQuestion.setChoices(new ArrayList<>(List.of(correct, wrong)));
    }

    private void stubActiveEnrollment() {
        LearnerCertification enrollment = LearnerCertification.builder()
                .learnerCertificationId(40L)
                .status(LearnerCertification.Status.active)
                .diagnosticCompletedAt(LocalDateTime.now())
                .build();
        lenient().when(learnerCertificationRepository
                .findFirstByLearner_LearnerIdAndCertification_CertificationIdAndStatus(
                        anyLong(), anyLong(), any()))
                .thenReturn(Optional.of(enrollment));
    }

    @Test
    void startSnapshotsQuestionsWithoutAnswerKeys() {
        stubActiveEnrollment();
        when(examRepository.findById(5L)).thenReturn(Optional.of(exam));
        lenient().when(examRepository.findAll()).thenReturn(List.of(exam));
        when(attemptRepository.findFirstByExam_ExamIdAndLearnerIdAndStatus(
                5L, 2L, AssessmentAttempt.Status.IN_PROGRESS))
                .thenReturn(Optional.empty());
        when(attemptRepository.findTopByExam_ExamIdAndLearnerIdOrderByAttemptNumberDesc(5L, 2L))
                .thenReturn(Optional.empty());
        ExamQuestion link = ExamQuestion.builder()
                .examQuestionId(50L).exam(exam).question(mcqQuestion).displayOrder(1).build();
        when(examQuestionRepository.findByExam_ExamIdOrderByDisplayOrderAsc(5L))
                .thenReturn(List.of(link));
        when(attemptRepository.save(any())).thenAnswer(inv -> {
            AssessmentAttempt attempt = inv.getArgument(0);
            attempt.setAssessmentAttemptId(77L);
            return attempt;
        });
        List<AssessmentAttemptQuestion> savedSnapshots = new ArrayList<>();
        when(attemptQuestionRepository.save(any())).thenAnswer(inv -> {
            AssessmentAttemptQuestion snapshot = inv.getArgument(0);
            snapshot.setAttemptQuestionId((long) (savedSnapshots.size() + 1));
            savedSnapshots.add(snapshot);
            return snapshot;
        });
        when(attemptQuestionRepository
                .findByAttempt_AssessmentAttemptIdOrderByDisplayOrderAsc(77L))
                .thenAnswer(inv -> savedSnapshots);
        when(attemptAnswerRepository.findByAttempt_AssessmentAttemptId(77L))
                .thenReturn(List.of());

        AssessmentAttemptStartResponseDto response =
                service.startAttempt(5L, 2L, "start-key");

        assertEquals(1, response.questions().size());
        assertEquals(2, response.questions().get(0).choices().size());
        // The snapshot JSON must not leak correctness flags or explanations.
        String snapshotJson = savedSnapshots.get(0).getQuestionDataSnapshot();
        assertFalse(snapshotJson.contains("correct"));
        assertFalse(snapshotJson.contains("explanation"));
    }

    @Test
    void submitScoresMcqServerSideAndIsIdempotent() {
        AssessmentAttempt attempt = AssessmentAttempt.builder()
                .assessmentAttemptId(77L)
                .exam(exam)
                .learnerId(2L)
                .attemptNumber(1)
                .status(AssessmentAttempt.Status.IN_PROGRESS)
                .startedAt(LocalDateTime.now().minusMinutes(5))
                .build();
        when(attemptRepository.findById(77L)).thenReturn(Optional.of(attempt));

        AssessmentAttemptQuestion snapshot = AssessmentAttemptQuestion.builder()
                .attemptQuestionId(1L)
                .attempt(attempt)
                .sourceQuestionId(100L)
                .questionType("MULTIPLE_CHOICE")
                .questionTextSnapshot(mcqQuestion.getQuestionText())
                .displayOrder(1)
                .points(BigDecimal.ONE)
                .lessonId(7L)
                .build();
        when(attemptQuestionRepository
                .findByAttempt_AssessmentAttemptIdOrderByDisplayOrderAsc(77L))
                .thenReturn(List.of(snapshot));
        when(attemptQuestionRepository.findById(1L)).thenReturn(Optional.of(snapshot));
        when(questionRepository.findById(100L)).thenReturn(Optional.of(mcqQuestion));

        List<AssessmentAttemptAnswer> answers = new ArrayList<>();
        when(attemptAnswerRepository
                .findByAttempt_AssessmentAttemptIdAndAttemptQuestion_AttemptQuestionId(77L, 1L))
                .thenAnswer(inv -> answers.stream().findFirst());
        when(attemptAnswerRepository.findByAttempt_AssessmentAttemptId(77L))
                .thenAnswer(inv -> answers);
        when(attemptAnswerRepository.save(any())).thenAnswer(inv -> {
            AssessmentAttemptAnswer answer = inv.getArgument(0);
            answer.setAttemptAnswerId(500L);
            if (!answers.contains(answer)) answers.add(answer);
            return answer;
        });
        when(attemptRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(examResultRepository.existsById(any())).thenReturn(false);

        // Learner picks the correct choice; the client sends no scores.
        SubmitAssessmentAttemptRequestDto request =
                new SubmitAssessmentAttemptRequestDto(2L, List.of(
                        new AttemptAnswerDraftDto(1L, null, 1000L, null, null, null)));

        AssessmentAttemptResultDto result = service.submitAttempt(77L, request);

        assertEquals(0, new BigDecimal("100.00").compareTo(result.percentage()));
        assertTrue(result.passed());
        assertEquals(1, result.correctCount());
        assertEquals(AssessmentAttempt.Status.SUBMITTED, attempt.getStatus());

        // A second submit returns the existing result without re-scoring.
        AssessmentAttemptResultDto again = service.submitAttempt(77L, request);
        assertEquals(result.percentage(), again.percentage());
        verify(examResultRepository, times(1)).save(any());
    }

    @Test
    void submitRejectsAnswersFromAnotherLearner() {
        AssessmentAttempt attempt = AssessmentAttempt.builder()
                .assessmentAttemptId(77L)
                .exam(exam)
                .learnerId(2L)
                .attemptNumber(1)
                .status(AssessmentAttempt.Status.IN_PROGRESS)
                .startedAt(LocalDateTime.now())
                .build();
        when(attemptRepository.findById(77L)).thenReturn(Optional.of(attempt));

        assertThrows(
                jakarta.persistence.EntityNotFoundException.class,
                () -> service.submitAttempt(77L,
                        new SubmitAssessmentAttemptRequestDto(999L, List.of())));
    }
}
