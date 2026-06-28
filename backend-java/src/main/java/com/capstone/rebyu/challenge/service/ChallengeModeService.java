package com.capstone.rebyu.challenge.service;

import com.capstone.rebyu.challenge.dto.ChallengeModeDto;
import com.capstone.rebyu.challenge.mapper.ChallengeModeMapper;
import com.capstone.rebyu.challenge.entity.ChallengeMode;
import com.capstone.rebyu.challenge.repository.ChallengeModeRepository;
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
public class ChallengeModeService {
    private final ChallengeModeRepository challengeModeRepository;
    private final ChallengeModeMapper challengeModeMapper;

    public List<ChallengeModeDto> getAll() {
        log.debug("Fetching all challenge modes");
        return challengeModeRepository.findAll().stream().map(challengeModeMapper::toDto).toList();
    }

    public ChallengeModeDto getById(Long id) {
        log.debug("Fetching challenge mode id: {}", id);
        return challengeModeMapper.toDto(findEntity(id));
    }

    public ChallengeModeDto create(ChallengeModeDto dto) {
        log.info("Creating new challenge mode");
        ChallengeMode entity = challengeModeMapper.toEntity(dto);
        entity.setChallengeModeId(null);
        ChallengeModeDto result = challengeModeMapper.toDto(challengeModeRepository.save(entity));
        log.info("ChallengeMode created with id: {}", result.getChallengeModeId());
        return result;
    }

    public ChallengeModeDto update(Long id, ChallengeModeDto dto) {
        log.info("Updating challenge mode id: {}", id);
        findEntity(id);
        ChallengeMode entity = challengeModeMapper.toEntity(dto);
        entity.setChallengeModeId(id);
        ChallengeModeDto result = challengeModeMapper.toDto(challengeModeRepository.save(entity));
        log.info("ChallengeMode id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting challenge mode id: {}", id);
        challengeModeRepository.delete(findEntity(id));
        log.info("ChallengeMode id: {} deleted", id);
    }

    private ChallengeMode findEntity(Long id) {
        return challengeModeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ChallengeMode not found: " + id));
    }
}
