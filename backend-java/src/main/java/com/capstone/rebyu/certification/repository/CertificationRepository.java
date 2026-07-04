package com.capstone.rebyu.certification.repository;

import com.capstone.rebyu.certification.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {

    @Query("""
            SELECT DISTINCT c FROM Certification c
            LEFT JOIN FETCH c.majorCategory mc
            LEFT JOIN FETCH mc.middleCategory mid
            LEFT JOIN FETCH mid.lessons
            WHERE c.certificationId = :id
            """)
    Optional<Certification> findByIdWithFullTree(@Param("id") Long id);
}
