package com.capstone.rebyu.community;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final JdbcTemplate jdbc;

    public record PostRequest(String postType, String title, String description, Long circleId,
                              String attachmentName, String attachmentType) {}
    public record CircleRequest(String name, String description, String topic) {}
    public record CommentRequest(String body, Long parentCommentId) {}
    public record Post(Long postId, String authorName, String initials, String community, OffsetDateTime createdAt,
                       String title, String description, String postType, Long circleId, String attachmentName,
                       String attachmentType, long reactions, long comments, boolean liked, boolean saved,
                       boolean ownedByMe) {}
    public record Circle(Long circleId, String initials, String name, String description, String topic,
                         long members, boolean joined, boolean owner) {}
    public record Comment(Long commentId, Long postId, Long parentCommentId, String authorName,
                          String initials, String body, OffsetDateTime createdAt, boolean ownedByMe) {}

    public List<Post> posts(Long learnerId, String type, String search, boolean savedOnly) {
        String sql = """
            SELECT p.*, concat(l.first_name, ' ', l.last_name) author_name, c.name community,
              (SELECT count(*) FROM community_post_likes x WHERE x.post_id=p.post_id) reactions,
              (SELECT count(*) FROM community_comments x WHERE x.post_id=p.post_id) comments,
              EXISTS(SELECT 1 FROM community_post_likes x WHERE x.post_id=p.post_id AND x.learner_id=?) liked,
              EXISTS(SELECT 1 FROM community_saved_posts x WHERE x.post_id=p.post_id AND x.learner_id=?) saved,
              (p.author_learner_id=?) owned_by_me
            FROM community_posts p JOIN learners l ON l.learner_id=p.author_learner_id
            LEFT JOIN community_circles c ON c.circle_id=p.circle_id
            WHERE (? IS NULL OR p.post_type=?)
              AND (? IS NULL OR lower(p.title || ' ' || p.body || ' ' || concat(l.first_name,' ',l.last_name)) LIKE '%' || lower(?) || '%')
              AND (NOT ? OR EXISTS(SELECT 1 FROM community_saved_posts s WHERE s.post_id=p.post_id AND s.learner_id=?))
            ORDER BY p.created_at DESC LIMIT 100
            """;
        String normalizedType = type == null || type.isBlank() || "for-you".equals(type) ? null : type;
        String normalizedSearch = search == null || search.isBlank() ? null : search.trim();
        return jdbc.query(sql, this::mapPost, learnerId, learnerId, learnerId, normalizedType, normalizedType,
                normalizedSearch, normalizedSearch, savedOnly, learnerId);
    }

    public List<Circle> circles(Long learnerId) {
        return jdbc.query("""
            SELECT c.*, (SELECT count(*) FROM community_circle_members m WHERE m.circle_id=c.circle_id) members,
              EXISTS(SELECT 1 FROM community_circle_members m WHERE m.circle_id=c.circle_id AND m.learner_id=?) joined,
              (c.owner_learner_id=?) owner
            FROM community_circles c ORDER BY members DESC, c.created_at DESC
            """, this::mapCircle, learnerId, learnerId);
    }

    @Transactional
    public Post createPost(Long learnerId, PostRequest request) {
        requireText(request.title(), "Title"); requireText(request.description(), "Description");
        String type = request.postType() == null ? "discussion" : request.postType();
        if (!List.of("discussion", "quizzes", "notes", "docx").contains(type)) throw new IllegalArgumentException("Unsupported post type");
        if (request.circleId() != null) requireMember(learnerId, request.circleId());
        Long id = jdbc.queryForObject("""
            INSERT INTO community_posts(author_learner_id,circle_id,post_type,title,body,attachment_name,attachment_type)
            VALUES (?,?,?,?,?,?,?) RETURNING post_id
            """, Long.class, learnerId, request.circleId(), type, request.title().trim(), request.description().trim(),
                blankToNull(request.attachmentName()), blankToNull(request.attachmentType()));
        return postById(learnerId, id);
    }

    @Transactional
    public Circle createCircle(Long learnerId, CircleRequest request) {
        requireText(request.name(), "Circle name"); requireText(request.description(), "Description"); requireText(request.topic(), "Topic");
        Long id = jdbc.queryForObject("INSERT INTO community_circles(owner_learner_id,name,description,topic) VALUES (?,?,?,?) RETURNING circle_id",
                Long.class, learnerId, request.name().trim(), request.description().trim(), request.topic().trim());
        jdbc.update("INSERT INTO community_circle_members(circle_id,learner_id) VALUES (?,?)", id, learnerId);
        jdbc.update("INSERT INTO community_posts(author_learner_id,circle_id,post_type,title,body) VALUES (?,?, 'circle', ?, ?)",
                learnerId, id, request.name().trim() + " is now open", request.description().trim());
        return circles(learnerId).stream().filter(c -> c.circleId().equals(id)).findFirst().orElseThrow();
    }

    @Transactional
    public boolean toggleJoin(Long learnerId, Long circleId) {
        Long owner = jdbc.queryForObject("SELECT owner_learner_id FROM community_circles WHERE circle_id=?", Long.class, circleId);
        if (owner == null) throw new EntityNotFoundException("Study circle not found");
        if (owner.equals(learnerId)) return true;
        int deleted = jdbc.update("DELETE FROM community_circle_members WHERE circle_id=? AND learner_id=?", circleId, learnerId);
        if (deleted == 0) jdbc.update("INSERT INTO community_circle_members(circle_id,learner_id) VALUES (?,?)", circleId, learnerId);
        return deleted == 0;
    }

    public boolean toggleLike(Long learnerId, Long postId) { return toggle("community_post_likes", learnerId, postId); }
    public boolean toggleSave(Long learnerId, Long postId) { return toggle("community_saved_posts", learnerId, postId); }

    @Transactional
    protected boolean toggle(String table, Long learnerId, Long postId) {
        int deleted = jdbc.update("DELETE FROM " + table + " WHERE post_id=? AND learner_id=?", postId, learnerId);
        if (deleted == 0) jdbc.update("INSERT INTO " + table + "(post_id,learner_id) VALUES (?,?)", postId, learnerId);
        return deleted == 0;
    }

    public List<Comment> comments(Long learnerId, Long postId) {
        return jdbc.query("""
            SELECT c.*, concat(l.first_name,' ',l.last_name) author_name FROM community_comments c
            JOIN learners l ON l.learner_id=c.author_learner_id WHERE c.post_id=? ORDER BY c.created_at
            """, (rs, n) -> mapComment(rs, learnerId), postId);
    }

    public Comment addComment(Long learnerId, Long postId, CommentRequest request) {
        requireText(request.body(), "Comment");
        Long id = jdbc.queryForObject("INSERT INTO community_comments(post_id,author_learner_id,parent_comment_id,body) VALUES (?,?,?,?) RETURNING comment_id",
                Long.class, postId, learnerId, request.parentCommentId(), request.body().trim());
        return jdbc.queryForObject("SELECT c.*, concat(l.first_name,' ',l.last_name) author_name FROM community_comments c JOIN learners l ON l.learner_id=c.author_learner_id WHERE c.comment_id=?",
                (rs, n) -> mapComment(rs, learnerId), id);
    }

    public void deletePost(Long learnerId, Long postId) {
        if (jdbc.update("DELETE FROM community_posts WHERE post_id=? AND author_learner_id=?", postId, learnerId) == 0)
            throw new IllegalArgumentException("You can only delete your own post");
    }

    private Post postById(Long learnerId, Long id) { return posts(learnerId, null, null, false).stream().filter(p -> p.postId().equals(id)).findFirst().orElseThrow(); }
    private void requireMember(Long learnerId, Long circleId) { if (jdbc.queryForObject("SELECT count(*) FROM community_circle_members WHERE circle_id=? AND learner_id=?", Integer.class, circleId, learnerId) == 0) throw new IllegalArgumentException("Join the study circle before posting"); }
    private static void requireText(String value, String field) { if (value == null || value.isBlank()) throw new IllegalArgumentException(field + " is required"); }
    private static String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private Post mapPost(ResultSet r, int n) throws SQLException { String a=r.getString("author_name"); return new Post(r.getLong("post_id"),a,initials(a),r.getString("community"),r.getObject("created_at",OffsetDateTime.class),r.getString("title"),r.getString("body"),r.getString("post_type"),(Long)r.getObject("circle_id"),r.getString("attachment_name"),r.getString("attachment_type"),r.getLong("reactions"),r.getLong("comments"),r.getBoolean("liked"),r.getBoolean("saved"),r.getBoolean("owned_by_me")); }
    private Circle mapCircle(ResultSet r, int n) throws SQLException { String name=r.getString("name"); return new Circle(r.getLong("circle_id"),initials(name),name,r.getString("description"),r.getString("topic"),r.getLong("members"),r.getBoolean("joined"),r.getBoolean("owner")); }
    private Comment mapComment(ResultSet r, Long me) throws SQLException { String a=r.getString("author_name"); return new Comment(r.getLong("comment_id"),r.getLong("post_id"),(Long)r.getObject("parent_comment_id"),a,initials(a),r.getString("body"),r.getObject("created_at",OffsetDateTime.class),me.equals(r.getLong("author_learner_id"))); }
    private static String initials(String s) { String[] p=s.trim().split("\\s+"); return (p[0].substring(0,1)+(p.length>1?p[p.length-1].substring(0,1):"")).toUpperCase(); }
}
