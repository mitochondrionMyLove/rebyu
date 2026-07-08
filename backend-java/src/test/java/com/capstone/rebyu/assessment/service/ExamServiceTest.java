package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamDto;
import com.capstone.rebyu.assessment.entity.Exam;
import com.capstone.rebyu.assessment.entity.ExamQuestion;
import com.capstone.rebyu.assessment.entity.ExamType;
import com.capstone.rebyu.assessment.entity.Question;
import com.capstone.rebyu.assessment.mapper.ExamMapper;
import com.capstone.rebyu.assessment.repository.ExamQuestionRepository;
import com.capstone.rebyu.assessment.repository.ExamRepository;
import com.capstone.rebyu.assessment.repository.QuestionRepository;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.entity.MajorCategory;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExamServiceTest {

    @Mock private ExamRepository examRepository;
    @Mock private ExamQuestionRepository examQuestionRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private ExamMapper examMapper;

    private ExamService service;

    @BeforeEach
    void setUp() {
        service = new ExamService(
                examRepository, examQuestionRepository, questionRepository, examMapper);
    }

    @Test
    void createSavesExamAndSelectedQuestionsInOneServiceTransaction() {
        ExamDto request = new ExamDto();
        request.setCertificationId(1L);
        request.setExamTypeId(2L);
        request.setTitle("TOPCIT Mock Exam 1");
        request.setTotalQuestions(2);
        request.setQuestionIds(List.of(10L, 11L));

        Exam mapped = exam(1L);
        mapped.setTitle(request.getTitle());
        mapped.setTotalQuestions(request.getTotalQuestions());

        when(examMapper.toEntity(request)).thenReturn(mapped);
        when(examRepository.save(any(Exam.class))).thenAnswer(invocation -> {
            Exam saved = invocation.getArgument(0);
            saved.setExamId(100L);
            return saved;
        });
        when(questionRepository.findAllById(List.of(10L, 11L)))
                .thenReturn(List.of(question(10L, 1L), question(11L, 1L)));
        when(examMapper.toDto(any(Exam.class))).thenAnswer(invocation -> {
            Exam saved = invocation.getArgument(0);
            ExamDto dto = new ExamDto();
            dto.setExamId(saved.getExamId());
            dto.setTotalQuestions(saved.getTotalQuestions());
            dto.setPassingScore(saved.getPassingScore());
            return dto;
        });

        ExamDto result = service.create(request);

        assertEquals(100L, result.getExamId());
        assertEquals(2, result.getTotalQuestions());
        assertEquals(new BigDecimal("70.00"), result.getPassingScore());
        verify(examQuestionRepository).deleteByExam_ExamId(100L);

        ArgumentCaptor<ExamQuestion> captor = ArgumentCaptor.forClass(ExamQuestion.class);
        verify(examQuestionRepository, times(2)).save(captor.capture());
        List<ExamQuestion> savedQuestions = captor.getAllValues();
        assertEquals(10L, savedQuestions.get(0).getQuestion().getQuestionId());
        assertEquals(1, savedQuestions.get(0).getDisplayOrder());
        assertEquals(11L, savedQuestions.get(1).getQuestion().getQuestionId());
        assertEquals(2, savedQuestions.get(1).getDisplayOrder());
    }

    private Exam exam(long certificationId) {
        Certification certification = new Certification();
        certification.setCertificationId(certificationId);

        ExamType examType = new ExamType();
        examType.setExamTypeId(2L);
        examType.setExamTypeText("MOCK_EXAM");

        Exam exam = new Exam();
        exam.setCertification(certification);
        exam.setExamType(examType);
        return exam;
    }

    private Question question(long questionId, long certificationId) {
        Certification certification = new Certification();
        certification.setCertificationId(certificationId);

        MajorCategory majorCategory = new MajorCategory();
        majorCategory.setCertification(certification);

        MiddleCategory middleCategory = new MiddleCategory();
        middleCategory.setMajorCategory(majorCategory);

        Lesson lesson = new Lesson();
        lesson.setLessonId(5L);
        lesson.setMiddleCategory(middleCategory);

        Question question = new Question();
        question.setQuestionId(questionId);
        question.setLesson(lesson);
        return question;
    }
}
