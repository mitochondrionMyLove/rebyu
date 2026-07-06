package com.capstone.rebyu.partnership.repository;

import com.capstone.rebyu.partnership.entity.PartnershipRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartnershipRequestItemRepository extends JpaRepository<PartnershipRequestItem, Long> {

    List<PartnershipRequestItem> findByPartnershipRequest_RequestId(Long requestId);
}
