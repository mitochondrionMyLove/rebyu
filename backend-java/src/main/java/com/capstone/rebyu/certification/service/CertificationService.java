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
        Certification certification = findEntity(id);

        return certificationMapper.toDto(certification);
    }

    public CertificationDto create(CertificationDto dto) {
        Certification certification = certificationMapper.toEntity(dto);

        certification.setCertificationId(null);

        connectChildEntities(certification);

        Certification savedCertification =
                certificationRepository.save(certification);

        log.info(
                "Created certification with ID: {}",
                savedCertification.getCertificationId()
        );

        return certificationMapper.toDto(savedCertification);
    }

    public CertificationDto update(Long id, CertificationDto dto) {
        Certification existingCertification = findEntity(id);

        /*
         * Convert the request DTO into an entity.
         *
         * Existing major/middle/lesson IDs from the request remain existing.
         * Newly added major/middle/lesson items should have null IDs.
         */
        Certification updatedCertification = certificationMapper.toEntity(dto);

        updatedCertification.setCertificationId(
                existingCertification.getCertificationId()
        );

        /*
         * Do not accidentally replace the original created date.
         * Your frontend does not need to edit this field.
         */
        updatedCertification.setDateCreated(
                existingCertification.getDateCreated()
        );

        /*
         * Keeps the existing image if the frontend does not send imageKey.
         */
        if (!StringUtils.hasText(updatedCertification.getImageKey())) {
            updatedCertification.setImageKey(
                    existingCertification.getImageKey()
            );
        }

        /*
         * Important:
         * Reconnects all parent-child entity relationships before saving.
         */
        connectChildEntities(updatedCertification);

        Certification savedCertification =
                certificationRepository.save(updatedCertification);

        log.info(
                "Updated certification with ID: {}",
                savedCertification.getCertificationId()
        );

        return certificationMapper.toDto(savedCertification);
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

    /*
     * Connects:
     *
     * Certification
     *   -> MajorCategory
     *      -> MiddleCategory
     *         -> Lesson
     *
     * This prevents null foreign-key values when saving newly added
     * major categories, middle categories, or lessons.
     */
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