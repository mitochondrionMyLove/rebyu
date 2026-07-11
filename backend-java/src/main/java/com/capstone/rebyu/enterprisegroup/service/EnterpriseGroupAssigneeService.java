package com.capstone.rebyu.enterprisegroup.service;

import com.capstone.rebyu.common.BusinessRuleException;
import com.capstone.rebyu.enrollment.entity.OrganizationCertificationLearner;
import com.capstone.rebyu.enrollment.repository.OrganizationCertificationLearnerRepository;
import com.capstone.rebyu.enterprisegroup.dto.EnterpriseGroupAssigneeDto;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroup;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroupAssignee;
import com.capstone.rebyu.enterprisegroup.mapper.EnterpriseGroupAssigneeMapper;
import com.capstone.rebyu.enterprisegroup.repository.EnterpriseGroupAssigneeRepository;
import com.capstone.rebyu.enterprisegroup.repository.EnterpriseGroupRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EnterpriseGroupAssigneeService {

    private final EnterpriseGroupAssigneeRepository enterpriseGroupAssigneeRepository;
    private final EnterpriseGroupRepository enterpriseGroupRepository;
    private final OrganizationCertificationLearnerRepository organizationCertificationLearnerRepository;
    private final EnterpriseGroupAssigneeMapper enterpriseGroupAssigneeMapper;

    @Transactional(readOnly = true)
    public List<EnterpriseGroupAssigneeDto> getAll(Long groupId) {
        List<EnterpriseGroupAssignee> assignees = groupId != null
                ? enterpriseGroupAssigneeRepository.findByEnterpriseGroup_EnterpriseGroupId(groupId)
                : enterpriseGroupAssigneeRepository.findAll();
        return assignees.stream().map(enterpriseGroupAssigneeMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public EnterpriseGroupAssigneeDto getById(Long id) {
        return enterpriseGroupAssigneeMapper.toDto(findEntity(id));
    }

    public EnterpriseGroupAssigneeDto create(EnterpriseGroupAssigneeDto dto) {
        log.info("Adding learner (orgCertLearnerId={}) to groupId={}",
                dto.getOrgCertLearnerId(), dto.getEnterpriseGroupId());

        EnterpriseGroup group = enterpriseGroupRepository.findById(dto.getEnterpriseGroupId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "EnterpriseGroup not found: " + dto.getEnterpriseGroupId()));

        OrganizationCertificationLearner learner = organizationCertificationLearnerRepository
                .findById(dto.getOrgCertLearnerId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "OrganizationCertificationLearner not found: " + dto.getOrgCertLearnerId()));

        // The learner must already hold org_cert access for the SAME allocation the
        // group belongs to — you cannot group a learner into another certification.
        Long groupOrgCertId = group.getOrgCert() != null ? group.getOrgCert().getOrgCertId() : null;
        Long learnerOrgCertId = learner.getOrgCert() != null ? learner.getOrgCert().getOrgCertId() : null;
        if (!Objects.equals(groupOrgCertId, learnerOrgCertId)) {
            throw new BusinessRuleException.EnterpriseGroupRuleException(
                    "This learner does not have access to the certification this group belongs to.");
        }

        if (enterpriseGroupAssigneeRepository.existsByEnterpriseGroupAndOrgCertLearner(group, learner)) {
            throw new BusinessRuleException.EnterpriseGroupRuleException(
                    "This learner is already assigned to this group.");
        }

        EnterpriseGroupAssignee entity = enterpriseGroupAssigneeMapper.toEntity(dto);
        entity.setEnterpriseGroupAssigneeId(null);
        entity.setAssignedAt(dto.getAssignedAt() != null ? dto.getAssignedAt() : LocalDateTime.now());
        entity.setStatus(EnterpriseGroupAssignee.Status.active);
        entity.setRemovedAt(null);
        EnterpriseGroupAssigneeDto result =
                enterpriseGroupAssigneeMapper.toDto(enterpriseGroupAssigneeRepository.save(entity));
        log.info("Enterprise group assignee created with id: {}", result.getEnterpriseGroupAssigneeId());
        return result;
    }

    /** Archive (soft-remove) a learner from a group. */
    public void delete(Long id) {
        log.info("Removing enterprise group assignee id: {}", id);
        EnterpriseGroupAssignee entity = findEntity(id);
        entity.setStatus(EnterpriseGroupAssignee.Status.archived);
        entity.setRemovedAt(LocalDateTime.now());
        enterpriseGroupAssigneeRepository.save(entity);
    }

    private EnterpriseGroupAssignee findEntity(Long id) {
        return enterpriseGroupAssigneeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EnterpriseGroupAssignee not found: " + id));
    }
}
