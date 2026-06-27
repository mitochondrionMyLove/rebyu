package com.capstone.rebyu.notification.entity;




import com.capstone.rebyu.organization.entity.Enterprise;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.user.entity.Learner;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "learner_invitations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerInvitation {

    public enum Status {
        PENDING, ACCEPTED, EXPIRED, REVOKED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invitationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_id", nullable = false)
    private Enterprise enterprise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id")
    private Certification certification;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id")
    private Learner learner;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "sent_date", nullable = false)
    private LocalDateTime sentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;
}
