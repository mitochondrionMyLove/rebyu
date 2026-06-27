package com.capstone.rebyu.organization.entity;


import com.capstone.rebyu.certification.entity.Certification;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "organization_certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationCertificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orgCertId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_id", nullable = false)
    private Enterprise enterprise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;

    @Column(name = "total_slots", nullable = false)
    private Integer totalSlots;

    @Column(name = "used_slots", nullable = false)
    private Integer usedSlots = 0;

    @Column(name = "remaining_slots", insertable = false, updatable = false)
    private Integer remainingSlots;
}
