package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.ChallengeSessionDto;
import com.capstone.rebyu.mappers.ChallengeSessionMapper;
import com.capstone.rebyu.models.ChallengeSession;
import com.capstone.rebyu.repositories.ChallengeSessionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ChallengeSessionService {
    private final ChallengeSessionRepository challengeSessionRepository;
    private final ChallengeSessionMapper challengeSessionMapper;

    public List<ChallengeSessionDto> getAll() {
        return challengeSessionRepository.findAll().stream().map(challengeSessionMapper::toDto).toList();
    }

    public ChallengeSessionDto getById(Long id) {
        return challengeSessionMapper.toDto(findEntity(id));
    }

    public ChallengeSessionDto create(ChallengeSessionDto dto) {
        ChallengeSession entity = challengeSessionMapper.toEntity(dto);
        entity.setChallengeSessionId(null);
        return challengeSessionMapper.toDto(challengeSessionRepository.save(entity));
    }

    public ChallengeSessionDto update(Long id, ChallengeSessionDto dto) {
        findEntity(id);
        ChallengeSession entity = challengeSessionMapper.toEntity(dto);
        entity.setChallengeSessionId(id);
        return challengeSessionMapper.toDto(challengeSessionRepository.save(entity));
    }

    public void delete(Long id) {
        challengeSessionRepository.delete(findEntity(id));
    }

    private ChallengeSession findEntity(Long id) {
        return challengeSessionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ChallengeSession not found: " + id));
    }
}
