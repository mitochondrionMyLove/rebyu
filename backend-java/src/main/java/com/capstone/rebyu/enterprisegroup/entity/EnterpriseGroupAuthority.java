package com.capstone.rebyu.enterprisegroup.entity;

import com.capstone.rebyu.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "enterprise_group_authorities",
        uniqueConstraints = @UniqueConstraint(columnNames = {"enterprise_group_id", "user_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnterpriseGroupAuthority {

    public enum Status {
        active, archived
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enterpriseGroupAuthorityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_group_id", nullable = false)
    private EnterpriseGroup enterpriseGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by", nullable = false)
    private User assignedBy;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.active;

    @Column(name = "removed_at")
    private LocalDateTime removedAt;
}
