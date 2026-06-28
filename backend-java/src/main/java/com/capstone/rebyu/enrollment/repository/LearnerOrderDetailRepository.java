package com.capstone.rebyu.enrollment.repository;

import com.capstone.rebyu.enrollment.entity.LearnerOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearnerOrderDetailRepository extends JpaRepository<LearnerOrderDetail, Long> {
    List<LearnerOrderDetail> findByOrder_OrderId(Long orderId);
}
