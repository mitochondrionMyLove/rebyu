package com.capstone.rebyu.partnership.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "partnership_meetings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnershipMeeting {

    public enum Status {
        scheduled, completed, cancelled, no_show
    }

    public enum Outcome {
        approved, rejected, cancelled
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long meetingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private PartnershipRequest partnershipRequest;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.scheduled;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Outcome outcome;
}
