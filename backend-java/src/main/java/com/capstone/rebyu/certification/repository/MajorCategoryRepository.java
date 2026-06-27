package com.capstone.rebyu.certification.repository;


import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.entity.MajorCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MajorCategoryRepository extends JpaRepository<MajorCategory, Long> {
}
