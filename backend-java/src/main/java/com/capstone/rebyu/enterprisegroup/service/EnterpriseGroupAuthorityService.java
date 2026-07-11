package com.capstone.rebyu.enterprisegroup.service;

import com.capstone.rebyu.common.BusinessRuleException;
import com.capstone.rebyu.enterprisegroup.dto.EnterpriseGroupAuthorityDto;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroup;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroupAuthority;
import com.capstone.rebyu.enterprisegroup.mapper.EnterpriseGroupAuthorityMapper;
import com.capstone.rebyu.enterprisegroup.repository.EnterpriseGroupAuthorityRepository;
import com.capstone.rebyu.enterprisegroup.repository.EnterpriseGroupRepository;
import com.capstone.rebyu.user.entity.User;
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
public class EnterpriseGroupAuthorityService {

    private final EnterpriseGroupAuthorityRepository enterpriseGroupAuthorityRepository;
    private final EnterpriseGroupRepository enterpriseGroupRepository;
    private final EnterpriseGroupAuthorityMapper enterpriseGroupAuthorityMapper;

    @Transactional(readOnly = true)
    public List<EnterpriseGroupAuthorityDto> getAll(Long groupId, Long userId) {
        List<EnterpriseGroupAuthority> authorities;
        if (groupId != null) {
            authorities = enterpriseGroupAuthorityRepository.findByEnterpriseGroup_EnterpriseGroupId(groupId);
        } else if (userId != null) {
            authorities = enterpriseGroupAuthorityRepository.findByUser_UserId(userId);
        } else {
            authorities = enterpriseGroupAuthorityRepository.findAll();
        }
        return authorities.stream().map(enterpriseGroupAuthorityMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public EnterpriseGroupAuthorityDto getById(Long id) {
        return enterpriseGroupAuthorityMapper.toDto(findEntity(id));
    }

    public EnterpriseGroupAuthorityDto create(EnterpriseGroupAuthorityDto dto) {
        log.info("Assigning authority userId={} to groupId={}", dto.getUserId(), dto.getEnterpriseGroupId());
        EnterpriseGroup group = enterpriseGroupRepository.findById(dto.getEnterpriseGroupId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "EnterpriseGroup not found: " + dto.getEnterpriseGroupId()));

        User user = User.builder().userId(dto.getUserId()).build();
        if (enterpriseGroupAuthorityRepository.existsByEnterpriseGroupAndUserAndStatus(
                group, user, EnterpriseGroupAuthority.Status.active)) {
            throw new BusinessRuleException.EnterpriseGroupRuleException(
                    "This user is already an active authority for this group.");
        }

        EnterpriseGroupAuthority entity = enterpriseGroupAuthorityMapper.toEntity(dto);
        entity.setEnterpriseGroupAuthorityId(null);
        entity.setAssignedAt(dto.getAssignedAt() != null ? dto.getAssignedAt() : LocalDateTime.now());
        entity.setStatus(EnterpriseGroupAuthority.Status.active);
        entity.setRemovedAt(null);
        EnterpriseGroupAuthorityDto result =
                enterpriseGroupAuthorityMapper.toDto(enterpriseGroupAuthorityRepository.save(entity));
        log.info("Enterprise group authority created with id: {}", result.getEnterpriseGroupAuthorityId());
        return result;
    }

    /** Archive (soft-remove) an authority assignment. */
    public void delete(Long id) {
        log.info("Removing enterprise group authority id: {}", id);
        EnterpriseGroupAuthority entity = findEntity(id);
        entity.setStatus(EnterpriseGroupAuthority.Status.archived);
        entity.setRemovedAt(LocalDateTime.now());
        enterpriseGroupAuthorityRepository.save(entity);
    }

    private EnterpriseGroupAuthority findEntity(Long id) {
        return enterpriseGroupAuthorityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EnterpriseGroupAuthority not found: " + id));
    }
}
