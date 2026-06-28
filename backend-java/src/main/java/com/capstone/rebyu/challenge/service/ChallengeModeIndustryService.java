package com.capstone.rebyu.challenge.service;

import com.capstone.rebyu.challenge.dto.ChallengeModeIndustryDto;
import com.capstone.rebyu.challenge.entity.ChallengeModeIndustry;
import com.capstone.rebyu.challenge.mapper.ChallengeModeIndustryMapper;
import com.capstone.rebyu.challenge.repository.ChallengeModeIndustryRepository;
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
public class ChallengeModeIndustryService {
    private final ChallengeModeIndustryRepository challengeModeIndustryRepository;
    private final ChallengeModeIndustryMapper challengeModeIndustryMapper;

    public List<ChallengeModeIndustryDto> getAll() {
        log.debug("Fetching all challenge mode industries");
        return challengeModeIndustryRepository.findAll().stream().map(challengeModeIndustryMapper::toDto).toList();
    }

    public List<ChallengeModeIndustryDto> getByChallengeModeId(Long challengeModeId) {
        log.debug("Fetching industries for challengeModeId: {}", challengeModeId);
        return challengeModeIndustryRepository.findByChallengeMode_ChallengeModeId(challengeModeId)
                .stream().map(challengeModeIndustryMapper::toDto).toList();
    }

    public ChallengeModeIndustryDto getById(Long id) {
        log.debug("Fetching challenge mode industry id: {}", id);
        return challengeModeIndustryMapper.toDto(findEntity(id));
    }

    public ChallengeModeIndustryDto create(ChallengeModeIndustryDto dto) {
        log.info("Creating new challenge mode industry");
        ChallengeModeIndustry entity = challengeModeIndustryMapper.toEntity(dto);
        entity.setChallengeModeIndustriesId(null);
        ChallengeModeIndustryDto result = challengeModeIndustryMapper.toDto(challengeModeIndustryRepository.save(entity));
        log.info("ChallengeModeIndustry created with id: {}", result.getChallengeModeIndustriesId());
        return result;
    }

    public ChallengeModeIndustryDto update(Long id, ChallengeModeIndustryDto dto) {
        log.info("Updating challenge mode industry id: {}", id);
        findEntity(id);
        ChallengeModeIndustry entity = challengeModeIndustryMapper.toEntity(dto);
        entity.setChallengeModeIndustriesId(id);
        ChallengeModeIndustryDto result = challengeModeIndustryMapper.toDto(challengeModeIndustryRepository.save(entity));
        log.info("ChallengeModeIndustry id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting challenge mode industry id: {}", id);
        challengeModeIndustryRepository.delete(findEntity(id));
        log.info("ChallengeModeIndustry id: {} deleted", id);
    }

    private ChallengeModeIndustry findEntity(Long id) {
        return challengeModeIndustryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ChallengeModeIndustry not found: " + id));
    }
}
