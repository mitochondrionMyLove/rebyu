package com.capstone.rebyu.enterprisegroup.service;

import com.capstone.rebyu.enterprisegroup.dto.EnterpriseGroupDto;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroup;
import com.capstone.rebyu.enterprisegroup.mapper.EnterpriseGroupMapper;
import com.capstone.rebyu.enterprisegroup.repository.EnterpriseGroupRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EnterpriseGroupService {

    private final EnterpriseGroupRepository enterpriseGroupRepository;
    private final EnterpriseGroupMapper enterpriseGroupMapper;

    @Transactional(readOnly = true)
    public List<EnterpriseGroupDto> getAll(Long enterpriseId, Long orgCertId) {
        List<EnterpriseGroup> groups;
        if (orgCertId != null) {
            groups = enterpriseGroupRepository.findByOrgCert_OrgCertId(orgCertId);
        } else if (enterpriseId != null) {
            groups = enterpriseGroupRepository.findByEnterprise_EnterpriseId(enterpriseId);
        } else {
            groups = enterpriseGroupRepository.findAll();
        }
        return groups.stream().map(enterpriseGroupMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public EnterpriseGroupDto getById(Long id) {
        return enterpriseGroupMapper.toDto(findEntity(id));
    }

    public EnterpriseGroupDto create(EnterpriseGroupDto dto) {
        log.info("Creating enterprise group '{}' for orgCertId={}", dto.getGroupName(), dto.getOrgCertId());
        EnterpriseGroup entity = enterpriseGroupMapper.toEntity(dto);
        entity.setEnterpriseGroupId(null);
        entity.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : EnterpriseGroup.Status.active);
        EnterpriseGroupDto result = enterpriseGroupMapper.toDto(enterpriseGroupRepository.save(entity));
        log.info("Enterprise group created with id: {}", result.getEnterpriseGroupId());
        return result;
    }

    public EnterpriseGroupDto update(Long id, EnterpriseGroupDto dto) {
        log.info("Updating enterprise group id: {}", id);
        // Mutate editable fields only; createdBy/createdAt/enterprise/orgCert are immutable.
        EnterpriseGroup entity = findEntity(id);
        entity.setGroupName(dto.getGroupName());
        entity.setGroupDescription(dto.getGroupDescription());
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
        return enterpriseGroupMapper.toDto(enterpriseGroupRepository.save(entity));
    }

    public void delete(Long id) {
        log.info("Archiving enterprise group id: {}", id);
        EnterpriseGroup entity = findEntity(id);
        entity.setStatus(EnterpriseGroup.Status.archived);
        enterpriseGroupRepository.save(entity);
    }

    private EnterpriseGroup findEntity(Long id) {
        return enterpriseGroupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EnterpriseGroup not found: " + id));
    }
}
