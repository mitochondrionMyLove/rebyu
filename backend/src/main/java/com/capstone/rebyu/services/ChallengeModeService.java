package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.ChallengeModeDto;
import com.capstone.rebyu.mappers.ChallengeModeMapper;
import com.capstone.rebyu.models.ChallengeMode;
import com.capstone.rebyu.repositories.ChallengeModeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ChallengeModeService {
    private final ChallengeModeRepository challengeModeRepository;
    private final ChallengeModeMapper challengeModeMapper;

    public List<ChallengeModeDto> getAll() {
        return challengeModeRepository.findAll().stream().map(challengeModeMapper::toDto).toList();
    }

    public ChallengeModeDto getById(Long id) {
        return challengeModeMapper.toDto(findEntity(id));
    }

    public ChallengeModeDto create(ChallengeModeDto dto) {
        ChallengeMode entity = challengeModeMapper.toEntity(dto);
        entity.setChallengeModeId(null);
        return challengeModeMapper.toDto(challengeModeRepository.save(entity));
    }

    public ChallengeModeDto update(Long id, ChallengeModeDto dto) {
        findEntity(id);
        ChallengeMode entity = challengeModeMapper.toEntity(dto);
        entity.setChallengeModeId(id);
        return challengeModeMapper.toDto(challengeModeRepository.save(entity));
    }

    public void delete(Long id) {
        challengeModeRepository.delete(findEntity(id));
    }

    private ChallengeMode findEntity(Long id) {
        return challengeModeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ChallengeMode not found: " + id));
    }
}
