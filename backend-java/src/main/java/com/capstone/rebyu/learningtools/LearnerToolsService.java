package com.capstone.rebyu.learningtools;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LearnerToolsService {
    private final JdbcTemplate jdbc;

    public record LibraryRequest(String itemType, String title, String description, String resourceUrl,
                                 Long certificationId, Long lessonId) {}
    public record LibraryItem(Long id, String kind, String title, String description, String route,
                              String downloadUrl, Long certificationId, String certificationTitle,
                              String lessonTitle, String details, OffsetDateTime createdAt, boolean ownedByMe) {}
    public record Mistake(Long mistakeId, Long questionId, String question, String questionType, String difficulty,
                          String certificationTitle, String lessonTitle, String attemptSource, String learnerAnswer,
                          String correctAnswer, String explanation, long mistakeCount, String masteryStatus,
                          boolean reviewed, OffsetDateTime lastMistakeAt) {}

    public List<LibraryItem> library(Long learnerId) {
        List<LibraryItem> items = jdbc.query("""
            SELECT i.*, c.title certification_title, l.name lesson_title
            FROM learner_library_items i
            LEFT JOIN certifications c ON c.certification_id=i.certification_id
            LEFT JOIN lessons l ON l.lesson_id=i.lesson_id
            WHERE i.learner_id=? ORDER BY i.created_at DESC
            """, this::mapLibrary, learnerId);
        items.addAll(jdbc.query("""
            SELECT p.post_id id, p.post_type kind, p.title, p.body description,
              p.attachment_name, p.created_at, c.name circle_name
            FROM community_saved_posts s JOIN community_posts p ON p.post_id=s.post_id
            LEFT JOIN community_circles c ON c.circle_id=p.circle_id
            WHERE s.learner_id=? ORDER BY s.created_at DESC
            """, (r,n) -> new LibraryItem(r.getLong("id"), "community", r.getString("title"),
                r.getString("description"), "/learner/community", null, null, r.getString("circle_name"), null,
                r.getString("attachment_name") == null ? "Saved community post" : r.getString("attachment_name"),
                r.getObject("created_at", OffsetDateTime.class), false), learnerId));
        return items;
    }

    public LibraryItem createLibraryItem(Long learnerId, LibraryRequest request) {
        require(request.title(), "Title");
        String type=request.itemType()==null ? "link" : request.itemType().toLowerCase();
        if (!List.of("quiz","flashcard","file","link","note").contains(type)) throw new IllegalArgumentException("Unsupported library item type");
        if (List.of("link", "file").contains(type)) require(request.resourceUrl(), "Resource URL");
        Long id=jdbc.queryForObject("""
            INSERT INTO learner_library_items(learner_id,certification_id,lesson_id,item_type,title,description,resource_url)
            VALUES (?,?,?,?,?,?,?) RETURNING library_item_id
            """,Long.class,learnerId,request.certificationId(),request.lessonId(),type,request.title().trim(),
                blank(request.description()),blank(request.resourceUrl()));
        return jdbc.queryForObject("""
            SELECT i.*, c.title certification_title, l.name lesson_title FROM learner_library_items i
            LEFT JOIN certifications c ON c.certification_id=i.certification_id LEFT JOIN lessons l ON l.lesson_id=i.lesson_id
            WHERE i.library_item_id=?
            """,this::mapLibrary,id);
    }

    public void deleteLibraryItem(Long learnerId, Long id) {
        if(jdbc.update("DELETE FROM learner_library_items WHERE library_item_id=? AND learner_id=?",id,learnerId)==0)
            throw new IllegalArgumentException("Library item not found or does not belong to you");
    }

    public List<Mistake> mistakes(Long learnerId) {
        return jdbc.query("""
            SELECT aq.source_question_id question_id, min(aq.attempt_question_id) mistake_id,
              aq.question_text_snapshot question, aq.question_type,
              coalesce(q.difficulty_level,'MEDIUM') difficulty, cert.title certification_title,
              l.name lesson_title, e.title attempt_source,
              (array_agg(coalesce(ans.learner_answer, ans.submitted_code, selected.choice_text, 'No answer submitted') ORDER BY a.submitted_at DESC))[1] learner_answer,
              coalesce(tc.correct_answer, correct_choice.choice_text, 'Review the assessment explanation') correct_answer,
              (array_agg(ans.feedback ORDER BY a.submitted_at DESC))[1] explanation,
              count(*) mistake_count, max(a.submitted_at) last_mistake_at,
              (mr.source_question_id IS NOT NULL) reviewed
            FROM assessment_attempt_answers ans
            JOIN assessment_attempt_questions aq ON aq.attempt_question_id=ans.attempt_question_id
            JOIN assessment_attempts a ON a.assessment_attempt_id=ans.assessment_attempt_id
            JOIN exams e ON e.exam_id=a.exam_id JOIN certifications cert ON cert.certification_id=e.certification_id
            LEFT JOIN questions q ON q.question_id=aq.source_question_id
            LEFT JOIN lessons l ON l.lesson_id=coalesce(aq.lesson_id,q.lesson_id)
            LEFT JOIN choices selected ON selected.choice_id=ans.selected_choice_id
            LEFT JOIN choices correct_choice ON correct_choice.question_id=aq.source_question_id AND correct_choice.is_correct=true
            LEFT JOIN text_question_configs tc ON tc.question_id=aq.source_question_id
            LEFT JOIN learner_mistake_reviews mr ON mr.learner_id=a.learner_id AND mr.source_question_id=aq.source_question_id
            WHERE a.learner_id=? AND a.status='SUBMITTED' AND ans.is_correct=false
            GROUP BY aq.source_question_id,aq.question_text_snapshot,aq.question_type,q.difficulty_level,cert.title,l.title,e.title,
                     tc.correct_answer,correct_choice.choice_text,mr.source_question_id
            ORDER BY last_mistake_at DESC
            """, this::mapMistake, learnerId);
    }

    public void markReviewed(Long learnerId, Long questionId, boolean reviewed) {
        if(reviewed) jdbc.update("INSERT INTO learner_mistake_reviews(learner_id,source_question_id) VALUES (?,?) ON CONFLICT (learner_id,source_question_id) DO UPDATE SET reviewed_at=now()",learnerId,questionId);
        else jdbc.update("DELETE FROM learner_mistake_reviews WHERE learner_id=? AND source_question_id=?",learnerId,questionId);
    }

    private LibraryItem mapLibrary(ResultSet r,int n)throws SQLException { String kind=r.getString("item_type"); String url=r.getString("resource_url"); return new LibraryItem(r.getLong("library_item_id"),kind,r.getString("title"),r.getString("description"),url,"file".equals(kind)?url:null,(Long)r.getObject("certification_id"),r.getString("certification_title"),r.getString("lesson_title"),kind.substring(0,1).toUpperCase()+kind.substring(1),r.getObject("created_at",OffsetDateTime.class),true); }
    private Mistake mapMistake(ResultSet r,int n)throws SQLException { long count=r.getLong("mistake_count"); return new Mistake(r.getLong("mistake_id"),r.getLong("question_id"),r.getString("question"),r.getString("question_type"),r.getString("difficulty"),r.getString("certification_title"),r.getString("lesson_title"),r.getString("attempt_source"),r.getString("learner_answer"),r.getString("correct_answer"),r.getString("explanation"),count,count>=2?"weak":"developing",r.getBoolean("reviewed"),r.getObject("last_mistake_at",OffsetDateTime.class)); }
    private static void require(String value,String name){if(value==null||value.isBlank())throw new IllegalArgumentException(name+" is required");}
    private static String blank(String value){return value==null||value.isBlank()?null:value.trim();}
}
