package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.CodingTestCaseDto;
import com.capstone.rebyu.assessment.entity.CodingTestCase;
import com.capstone.rebyu.assessment.mapper.CodingTestCaseMapper;
import com.capstone.rebyu.assessment.repository.CodingTestCaseRepository;
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
public class CodingTestCaseService {
    private final CodingTestCaseRepository codingTestCaseRepository;
    private final CodingTestCaseMapper codingTestCaseMapper;

    public List<CodingTestCaseDto> getAll() {
        log.debug("Fetching all coding test cases");
        return codingTestCaseRepository.findAll().stream().map(codingTestCaseMapper::toDto).toList();
    }

    public List<CodingTestCaseDto> getByNoChoiceQuestionId(Long noChoiceQuestionId) {
        log.debug("Fetching coding test cases for noChoiceQuestionId: {}", noChoiceQuestionId);
        return codingTestCaseRepository.findByNoChoiceQuestion_NoChoiceQuestionId(noChoiceQuestionId)
                .stream().map(codingTestCaseMapper::toDto).toList();
    }

    public CodingTestCaseDto getById(Long id) {
        log.debug("Fetching coding test case id: {}", id);
        return codingTestCaseMapper.toDto(findEntity(id));
    }

    public CodingTestCaseDto create(CodingTestCaseDto dto) {
        log.info("Creating new coding test case");
        CodingTestCase entity = codingTestCaseMapper.toEntity(dto);
        entity.setCodingTestCaseId(null);
        CodingTestCaseDto result = codingTestCaseMapper.toDto(codingTestCaseRepository.save(entity));
        log.info("CodingTestCase created with id: {}", result.getCodingTestCaseId());
        return result;
    }

    public CodingTestCaseDto update(Long id, CodingTestCaseDto dto) {
        log.info("Updating coding test case id: {}", id);
        findEntity(id);
        CodingTestCase entity = codingTestCaseMapper.toEntity(dto);
        entity.setCodingTestCaseId(id);
        CodingTestCaseDto result = codingTestCaseMapper.toDto(codingTestCaseRepository.save(entity));
        log.info("CodingTestCase id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting coding test case id: {}", id);
        codingTestCaseRepository.delete(findEntity(id));
        log.info("CodingTestCase id: {} deleted", id);
    }

    private CodingTestCase findEntity(Long id) {
        return codingTestCaseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CodingTestCase not found: " + id));
    }
}
