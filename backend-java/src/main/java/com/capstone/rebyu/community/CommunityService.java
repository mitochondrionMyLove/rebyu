package com.capstone.rebyu.community;

import com.capstone.rebyu.certification.service.S3StorageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Learner community: discussion/resource posts, study circles, likes, saves,
 * and comments. Backed by plain JDBC over the {@code community_*} tables
 * (V24/V25/V27) rather than JPA entities — the schema is small and read-heavy
 * with a few bespoke toggle/aggregate queries that don't benefit much from an
 * ORM layer.
 */
@Service
@RequiredArgsConstructor
public class CommunityService {

    private static final List<String> ALLOWED_POST_TYPES =
            List.of("discussion", "quizzes", "notes", "docx");

    private final JdbcTemplate jdbc;
    private final S3StorageService s3StorageService;

    public record PostRequest(
            String postType, String title, String description, Long circleId,
            String attachmentName, String attachmentType, String attachmentKey) {}

    public record CircleRequest(String name, String description, String topic) {}

    public record CommentRequest(String body, Long parentCommentId) {}

    public record Post(
            Long postId, String authorName, String initials, String community, OffsetDateTime createdAt,
            String title, String description, String postType, Long circleId,
            String attachmentName, String attachmentType, String attachmentKey,
            long reactions, long comments, boolean liked, boolean saved, boolean ownedByMe) {}

    public record Circle(
            Long circleId, String initials, String name, String description, String topic,
            long members, boolean joined, boolean owner) {}

    public record Comment(
            Long commentId, Long postId, Long parentCommentId, String authorName,
            String initials, String body, OffsetDateTime createdAt, boolean ownedByMe) {}

    // ------------------------------------------------------------------
    // Posts
    // ------------------------------------------------------------------

    private static final String POST_SELECT = """
            SELECT p.*, concat(l.first_name, ' ', l.last_name) author_name, c.name community,
              (SELECT count(*) FROM community_post_likes x WHERE x.post_id=p.post_id) reactions,
              (SELECT count(*) FROM community_comments x WHERE x.post_id=p.post_id) comments,
              EXISTS(SELECT 1 FROM community_post_likes x WHERE x.post_id=p.post_id AND x.learner_id=:learnerId) liked,
              EXISTS(SELECT 1 FROM community_saved_posts x WHERE x.post_id=p.post_id AND x.learner_id=:learnerId) saved,
              (p.author_learner_id=:learnerId) owned_by_me
            FROM community_posts p
            JOIN learners l ON l.learner_id=p.author_learner_id
            LEFT JOIN community_circles c ON c.circle_id=p.circle_id
            """;

    public List<Post> posts(Long learnerId, String type, String search, boolean savedOnly) {
        String normalizedType = normalizeFilter(type, "for-you");
        String normalizedSearch = normalizeFilter(search, null);

        StringBuilder sql = new StringBuilder(sqlWithLearnerId(POST_SELECT, learnerId))
                .append(" WHERE 1=1");
        List<Object> args = new java.util.ArrayList<>(List.of(learnerId, learnerId, learnerId));

        if (normalizedType != null) {
            sql.append(" AND p.post_type=?");
            args.add(normalizedType);
        }
        if (normalizedSearch != null) {
            sql.append(" AND lower(p.title || ' ' || p.body || ' ' || concat(l.first_name,' ',l.last_name)) LIKE ?");
            args.add("%" + normalizedSearch.toLowerCase() + "%");
        }
        if (savedOnly) {
            sql.append(" AND EXISTS(SELECT 1 FROM community_saved_posts s WHERE s.post_id=p.post_id AND s.learner_id=?)");
            args.add(learnerId);
        }
        sql.append(" ORDER BY p.created_at DESC LIMIT 200");

        return jdbc.query(sql.toString(), this::mapPost, args.toArray());
    }

    private Post postById(Long learnerId, Long postId) {
        String sql = sqlWithLearnerId(POST_SELECT, learnerId) + " WHERE p.post_id=?";
        List<Post> found = jdbc.query(sql, this::mapPost, learnerId, learnerId, learnerId, postId);
        if (found.isEmpty()) {
            throw new EntityNotFoundException("Post not found: " + postId);
        }
        return found.get(0);
    }

    /** Positional "?" placeholders throughout; this just documents the three
     *  learnerId occurrences already baked into {@link #POST_SELECT}. */
    private String sqlWithLearnerId(String sql, Long learnerId) {
        return sql.replace(":learnerId", "?");
    }

    @Transactional
    public Post createPost(Long learnerId, PostRequest request) {
        requireText(request.title(), "Title");
        requireText(request.description(), "Description");

        String type = request.postType() == null ? "discussion" : request.postType();
        if (!ALLOWED_POST_TYPES.contains(type)) {
            throw new IllegalArgumentException("Unsupported post type: " + type);
        }
        if (request.circleId() != null) {
            requireCircleMember(learnerId, request.circleId());
        }

        Long postId = jdbc.queryForObject("""
                INSERT INTO community_posts
                    (author_learner_id, circle_id, post_type, title, body,
                     attachment_name, attachment_type, attachment_key)
                VALUES (?,?,?,?,?,?,?,?)
                RETURNING post_id
                """, Long.class,
                learnerId, request.circleId(), type, request.title().trim(), request.description().trim(),
                blankToNull(request.attachmentName()), blankToNull(request.attachmentType()),
                blankToNull(request.attachmentKey()));

        return postById(learnerId, postId);
    }

    public void deletePost(Long learnerId, Long postId) {
        int deleted = jdbc.update(
                "DELETE FROM community_posts WHERE post_id=? AND author_learner_id=?", postId, learnerId);
        if (deleted == 0) {
            throw new IllegalArgumentException("You can only delete your own post");
        }
    }

    /** Uploads a PDF/DOCX attachment and returns its key. Call before {@link #createPost}. */
    public String uploadAttachment(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A file is required");
        }
        try {
            return s3StorageService.uploadFile(file, "community-attachments");
        } catch (IOException e) {
            throw new IllegalStateException("The attachment could not be uploaded", e);
        }
    }

    // ------------------------------------------------------------------
    // Likes / saves
    // ------------------------------------------------------------------

    public boolean toggleLike(Long learnerId, Long postId) {
        return toggle("community_post_likes", learnerId, postId);
    }

    public boolean toggleSave(Long learnerId, Long postId) {
        return toggle("community_saved_posts", learnerId, postId);
    }

    /** Returns true when the row now exists (i.e. the toggle turned it "on"). */
    @Transactional
    protected boolean toggle(String table, Long learnerId, Long postId) {
        int deleted = jdbc.update(
                "DELETE FROM " + table + " WHERE post_id=? AND learner_id=?", postId, learnerId);
        if (deleted == 0) {
            jdbc.update("INSERT INTO " + table + "(post_id, learner_id) VALUES (?, ?)", postId, learnerId);
        }
        return deleted == 0;
    }

    // ------------------------------------------------------------------
    // Comments
    // ------------------------------------------------------------------

    private static final String COMMENT_SELECT = """
            SELECT c.*, concat(l.first_name, ' ', l.last_name) author_name
            FROM community_comments c
            JOIN learners l ON l.learner_id = c.author_learner_id
            """;

    public List<Comment> comments(Long learnerId, Long postId) {
        return jdbc.query(
                COMMENT_SELECT + " WHERE c.post_id=? ORDER BY c.created_at",
                (r, n) -> mapComment(r, learnerId), postId);
    }

    public Comment addComment(Long learnerId, Long postId, CommentRequest request) {
        requireText(request.body(), "Comment");
        Long commentId = jdbc.queryForObject("""
                INSERT INTO community_comments(post_id, author_learner_id, parent_comment_id, body)
                VALUES (?, ?, ?, ?)
                RETURNING comment_id
                """, Long.class, postId, learnerId, request.parentCommentId(), request.body().trim());

        return jdbc.queryForObject(
                COMMENT_SELECT + " WHERE c.comment_id=?",
                (r, n) -> mapComment(r, learnerId), commentId);
    }

    // ------------------------------------------------------------------
    // Circles
    // ------------------------------------------------------------------

    private static final String CIRCLE_SELECT = """
            SELECT c.*,
              (SELECT count(*) FROM community_circle_members m WHERE m.circle_id=c.circle_id) members,
              EXISTS(SELECT 1 FROM community_circle_members m WHERE m.circle_id=c.circle_id AND m.learner_id=?) joined,
              (c.owner_learner_id=?) owner
            FROM community_circles c
            """;

    public List<Circle> circles(Long learnerId) {
        return jdbc.query(
                CIRCLE_SELECT + " ORDER BY members DESC, c.created_at DESC",
                this::mapCircle, learnerId, learnerId);
    }

    private Circle circleById(Long learnerId, Long circleId) {
        List<Circle> found = jdbc.query(
                CIRCLE_SELECT + " WHERE c.circle_id=?", this::mapCircle, learnerId, learnerId, circleId);
        if (found.isEmpty()) {
            throw new EntityNotFoundException("Study circle not found: " + circleId);
        }
        return found.get(0);
    }

    @Transactional
    public Circle createCircle(Long learnerId, CircleRequest request) {
        requireText(request.name(), "Circle name");
        requireText(request.description(), "Description");
        requireText(request.topic(), "Topic");

        Long circleId = jdbc.queryForObject(
                "INSERT INTO community_circles(owner_learner_id, name, description, topic) VALUES (?,?,?,?) RETURNING circle_id",
                Long.class, learnerId, request.name().trim(), request.description().trim(), request.topic().trim());

        jdbc.update("INSERT INTO community_circle_members(circle_id, learner_id) VALUES (?, ?)", circleId, learnerId);
        jdbc.update("""
                INSERT INTO community_posts(author_learner_id, circle_id, post_type, title, body)
                VALUES (?, ?, 'circle', ?, ?)
                """, learnerId, circleId, request.name().trim() + " is now open", request.description().trim());

        return circleById(learnerId, circleId);
    }

    /** Owners are always members and cannot leave their own circle. Returns the joined state. */
    @Transactional
    public boolean toggleJoin(Long learnerId, Long circleId) {
        Long owner = jdbc.query(
                "SELECT owner_learner_id FROM community_circles WHERE circle_id=?",
                (r, n) -> r.getLong("owner_learner_id"), circleId).stream().findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Study circle not found: " + circleId));

        if (owner.equals(learnerId)) {
            return true;
        }
        int deleted = jdbc.update(
                "DELETE FROM community_circle_members WHERE circle_id=? AND learner_id=?", circleId, learnerId);
        if (deleted == 0) {
            jdbc.update("INSERT INTO community_circle_members(circle_id, learner_id) VALUES (?, ?)", circleId, learnerId);
        }
        return deleted == 0;
    }

    private void requireCircleMember(Long learnerId, Long circleId) {
        Integer count = jdbc.queryForObject(
                "SELECT count(*) FROM community_circle_members WHERE circle_id=? AND learner_id=?",
                Integer.class, circleId, learnerId);
        if (count == null || count == 0) {
            throw new IllegalArgumentException("Join the study circle before posting");
        }
    }

    // ------------------------------------------------------------------
    // Mapping / helpers
    // ------------------------------------------------------------------

    private Post mapPost(ResultSet row, int rowNum) throws SQLException {
        String authorName = row.getString("author_name");
        return new Post(
                row.getLong("post_id"),
                authorName,
                initials(authorName),
                row.getString("community"),
                row.getObject("created_at", OffsetDateTime.class),
                row.getString("title"),
                row.getString("body"),
                row.getString("post_type"),
                (Long) row.getObject("circle_id"),
                row.getString("attachment_name"),
                row.getString("attachment_type"),
                row.getString("attachment_key"),
                row.getLong("reactions"),
                row.getLong("comments"),
                row.getBoolean("liked"),
                row.getBoolean("saved"),
                row.getBoolean("owned_by_me"));
    }

    private Circle mapCircle(ResultSet row, int rowNum) throws SQLException {
        String name = row.getString("name");
        return new Circle(
                row.getLong("circle_id"),
                initials(name),
                name,
                row.getString("description"),
                row.getString("topic"),
                row.getLong("members"),
                row.getBoolean("joined"),
                row.getBoolean("owner"));
    }

    private Comment mapComment(ResultSet row, Long viewerLearnerId) throws SQLException {
        String authorName = row.getString("author_name");
        return new Comment(
                row.getLong("comment_id"),
                row.getLong("post_id"),
                (Long) row.getObject("parent_comment_id"),
                authorName,
                initials(authorName),
                row.getString("body"),
                row.getObject("created_at", OffsetDateTime.class),
                viewerLearnerId.equals(row.getLong("author_learner_id")));
    }

    /** "for-you" is the client's "no filter" tab; treat it (and blank) as no type filter. */
    private static String normalizeFilter(String value, String noiseValue) {
        if (value == null || value.isBlank() || value.equals(noiseValue)) {
            return null;
        }
        return value.trim();
    }

    private static void requireText(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " is required");
        }
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    /** First letter of up to two whitespace-separated name tokens, uppercased. Safe on blank tokens. */
    private static String initials(String name) {
        if (name == null || name.isBlank()) {
            return "?";
        }
        String[] parts = name.trim().split("\\s+");
        StringBuilder result = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                result.append(Character.toUpperCase(part.charAt(0)));
            }
            if (result.length() >= 2) {
                break;
            }
        }
        return result.isEmpty() ? "?" : result.toString();
    }
}
