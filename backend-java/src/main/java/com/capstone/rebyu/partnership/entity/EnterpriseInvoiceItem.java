package com.capstone.rebyu.partnership.entity;

import com.capstone.rebyu.certification.entity.Certification;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "enterprise_invoice_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnterpriseInvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enterpriseInvoiceItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_invoice_id", nullable = false)
    private EnterpriseInvoice enterpriseInvoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;

    @Column(name = "learner_slots")
    private Integer learnerSlots;

    @Column(name = "validity_months", nullable = false)
    private Integer validityMonths;
}
