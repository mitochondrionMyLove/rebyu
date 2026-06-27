package com.capstone.rebyu.enrollment.entity;




import com.capstone.rebyu.organization.entity.Enterprise;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.user.entity.Learner;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "organization_certification_learners",
        uniqueConstraints = @UniqueConstraint(columnNames = {"organization_id", "certification_id", "learner_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationCertificationLearner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orgCertLearnersId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Enterprise organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id", nullable = false)
    private Learner learner;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(nullable = false)
    private BigDecimal progress = BigDecimal.ZERO;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
