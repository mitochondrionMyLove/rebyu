package com.capstone.rebyu.certification.service;

import com.capstone.rebyu.certification.dto.CertificationDto;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.entity.MajorCategory;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import com.capstone.rebyu.certification.mapper.CertificationMapper;
import com.capstone.rebyu.certification.repository.CertificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final CertificationMapper certificationMapper;

    @Transactional(readOnly = true)
    public List<CertificationDto> getAll() {
        return certificationRepository.findAll()
                .stream()
                .map(certificationMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CertificationDto getById(Long id) {
        Certification certification = certificationRepository.findByIdWithFullTree(id)
                .orElseThrow(() -> new EntityNotFoundException("Certification not found with ID: " + id));
        return certificationMapper.toDto(certification);
    }

    public CertificationDto create(CertificationDto dto) {
        Certification certification = certificationMapper.toEntity(dto);

        certification.setCertificationId(null);
        certification.setDateCreated(LocalDateTime.now());
        certification.setDateUpdated(null);

        addDefaultHierarchyIfEmpty(certification);
        connectChildEntities(certification);

        Certification savedCertification =
                certificationRepository.save(certification);

        log.info(
                "Created certification with ID: {}",
                savedCertification.getCertificationId()
        );

        return certificationMapper.toDto(
                certificationRepository.findByIdWithFullTree(savedCertification.getCertificationId()).orElseThrow()
        );
    }

    public CertificationDto update(Long id, CertificationDto dto) {
        Certification existingCertification = findEntity(id);







        Certification updatedCertification = certificationMapper.toEntity(dto);

        updatedCertification.setCertificationId(
                existingCertification.getCertificationId()
        );





        updatedCertification.setDateCreated(
                existingCertification.getDateCreated()
        );




        if (!StringUtils.hasText(updatedCertification.getImageKey())) {
            updatedCertification.setImageKey(
                    existingCertification.getImageKey()
            );
        }

        updatedCertification.setDateUpdated(LocalDateTime.now());

        connectChildEntities(updatedCertification);

        Certification savedCertification =
                certificationRepository.save(updatedCertification);

        log.info(
                "Updated certification with ID: {}",
                savedCertification.getCertificationId()
        );

        return certificationMapper.toDto(
                certificationRepository.findByIdWithFullTree(savedCertification.getCertificationId()).orElseThrow()
        );
    }

    public void delete(Long id) {
        Certification certification = findEntity(id);

        certificationRepository.delete(certification);

        log.info("Deleted certification with ID: {}", id);
    }

    private Certification findEntity(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Certification not found with ID: " + id
                        )
                );
    }












    private void addDefaultHierarchyIfEmpty(Certification certification) {
        if (certification.getMajorCategory() != null
                && !certification.getMajorCategory().isEmpty()) {
            return;
        }

        Lesson lesson = new Lesson();
        lesson.setName("Untitled Lesson");
        lesson.setLessonComponentStructure("[]");

        MiddleCategory middleCategory = new MiddleCategory();
        middleCategory.setTitle("Untitled Middle Category");
        middleCategory.getLessons().add(lesson);

        MajorCategory majorCategory = new MajorCategory();
        majorCategory.setTitle("Untitled Major Category");
        majorCategory.getMiddleCategory().add(middleCategory);

        if (certification.getMajorCategory() == null) {
            certification.setMajorCategory(new java.util.ArrayList<>());
        }
        certification.getMajorCategory().add(majorCategory);
    }

    private void connectChildEntities(Certification certification) {
        if (certification.getMajorCategory() == null) {
            return;
        }

        for (MajorCategory majorCategory : certification.getMajorCategory()) {
            majorCategory.setCertification(certification);

            if (majorCategory.getMiddleCategory() == null) {
                continue;
            }

            for (MiddleCategory middleCategory : majorCategory.getMiddleCategory()) {
                middleCategory.setMajorCategory(majorCategory);

                if (middleCategory.getLessons() == null) {
                    continue;
                }

                for (Lesson lesson : middleCategory.getLessons()) {
                    lesson.setMiddleCategory(middleCategory);
                }
            }
        }
    }
}