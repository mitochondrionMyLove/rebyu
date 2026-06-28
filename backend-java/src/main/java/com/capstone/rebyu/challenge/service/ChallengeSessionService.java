package com.capstone.rebyu.challenge.service;

import com.capstone.rebyu.challenge.dto.ChallengeSessionDto;
import com.capstone.rebyu.challenge.mapper.ChallengeSessionMapper;
import com.capstone.rebyu.challenge.entity.ChallengeSession;
import com.capstone.rebyu.challenge.repository.ChallengeSessionRepository;
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
public class ChallengeSessionService {
    private final ChallengeSessionRepository challengeSessionRepository;
    private final ChallengeSessionMapper challengeSessionMapper;

    public List<ChallengeSessionDto> getAll() {
        log.debug("Fetching all challenge sessions");
        return challengeSessionRepository.findAll().stream().map(challengeSessionMapper::toDto).toList();
    }

    public ChallengeSessionDto getById(Long id) {
        log.debug("Fetching challenge session id: {}", id);
        return challengeSessionMapper.toDto(findEntity(id));
    }

    public ChallengeSessionDto create(ChallengeSessionDto dto) {
        log.info("Creating new challenge session");
        ChallengeSession entity = challengeSessionMapper.toEntity(dto);
        entity.setChallengeSessionId(null);
        ChallengeSessionDto result = challengeSessionMapper.toDto(challengeSessionRepository.save(entity));
        log.info("ChallengeSession created with id: {}", result.getChallengeSessionId());
        return result;
    }

    public ChallengeSessionDto update(Long id, ChallengeSessionDto dto) {
        log.info("Updating challenge session id: {}", id);
        findEntity(id);
        ChallengeSession entity = challengeSessionMapper.toEntity(dto);
        entity.setChallengeSessionId(id);
        ChallengeSessionDto result = challengeSessionMapper.toDto(challengeSessionRepository.save(entity));
        log.info("ChallengeSession id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting challenge session id: {}", id);
        challengeSessionRepository.delete(findEntity(id));
        log.info("ChallengeSession id: {} deleted", id);
    }

    private ChallengeSession findEntity(Long id) {
        return challengeSessionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ChallengeSession not found: " + id));
    }
}
