package com.capstone.rebyu.enrollment.entity;



import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.user.entity.Learner;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "learner_certifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerCertification {
    @EmbeddedId
    private LearnerCertificationId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id")
    @MapsId("learnerId")
    private Learner learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id")
    @MapsId("certificationId")
    private Certification certification;

    @Column(name = "date_purchased", nullable = false)
    private LocalDateTime datePurchased;
}
