package com.capstone.rebyu.partnership.entity;


import com.capstone.rebyu.organization.entity.Enterprise;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "partnership_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnershipRequest {

    public enum Status {
        PENDING, UNDER_REVIEW, MEETING_SCHEDULED, APPROVED, REJECTED, CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_id", nullable = false)
    private Enterprise enterprise;

    @Column(name = "submitted_date", nullable = false)
    private LocalDateTime submittedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    private Status status = Status.PENDING;
}
