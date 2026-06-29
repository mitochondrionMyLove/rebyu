package com.capstone.rebyu.organization.service;

import com.capstone.rebyu.organization.dto.EnterpriseMemberDto;
import com.capstone.rebyu.organization.entity.EnterpriseMember;
import com.capstone.rebyu.organization.mapper.EnterpriseMemberMapper;
import com.capstone.rebyu.organization.repository.EnterpriseMemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EnterpriseMemberService {
    private final EnterpriseMemberRepository enterpriseMemberRepository;
    private final EnterpriseMemberMapper enterpriseMemberMapper;

    public List<EnterpriseMemberDto> getAll() {
        log.debug("Fetching all enterprise members");
        return enterpriseMemberRepository.findAll().stream().map(enterpriseMemberMapper::toDto).toList();
    }

    public List<EnterpriseMemberDto> getByEnterpriseId(Long enterpriseId) {
        log.debug("Fetching members for enterpriseId: {}", enterpriseId);
        return enterpriseMemberRepository.findByEnterprise_EnterpriseId(enterpriseId)
                .stream().map(enterpriseMemberMapper::toDto).toList();
    }

    public EnterpriseMemberDto getById(Long id) {
        log.debug("Fetching enterprise member id: {}", id);
        return enterpriseMemberMapper.toDto(findEntity(id));
    }

    public EnterpriseMemberDto create(EnterpriseMemberDto dto) {
        log.info("Creating new enterprise member");
        EnterpriseMember entity = enterpriseMemberMapper.toEntity(dto);
        entity.setEnterpriseMemberId(null);
        EnterpriseMemberDto result = enterpriseMemberMapper.toDto(enterpriseMemberRepository.save(entity));
        log.info("EnterpriseMember created with id: {}", result.getEnterpriseMemberId());
        return result;
    }

    public EnterpriseMemberDto update(Long id, EnterpriseMemberDto dto) {
        log.info("Updating enterprise member id: {}", id);
        findEntity(id);
        EnterpriseMember entity = enterpriseMemberMapper.toEntity(dto);
        entity.setEnterpriseMemberId(id);
        EnterpriseMemberDto result = enterpriseMemberMapper.toDto(enterpriseMemberRepository.save(entity));
        log.info("EnterpriseMember id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting enterprise member id: {}", id);
        enterpriseMemberRepository.delete(findEntity(id));
        log.info("EnterpriseMember id: {} deleted", id);
    }

    private EnterpriseMember findEntity(Long id) {
        return enterpriseMemberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EnterpriseMember not found: " + id));
    }
}
