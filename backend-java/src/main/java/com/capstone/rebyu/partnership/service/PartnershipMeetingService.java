package com.capstone.rebyu.partnership.service;

import com.capstone.rebyu.partnership.dto.PartnershipMeetingDto;
import com.capstone.rebyu.partnership.mapper.PartnershipMeetingMapper;
import com.capstone.rebyu.partnership.entity.PartnershipMeeting;
import com.capstone.rebyu.partnership.repository.PartnershipMeetingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PartnershipMeetingService {
    private final PartnershipMeetingRepository partnershipMeetingRepository;
    private final PartnershipMeetingMapper partnershipMeetingMapper;

    public List<PartnershipMeetingDto> getAll() {
        return partnershipMeetingRepository.findAll().stream().map(partnershipMeetingMapper::toDto).toList();
    }

    public PartnershipMeetingDto getById(Long id) {
        return partnershipMeetingMapper.toDto(findEntity(id));
    }

    public PartnershipMeetingDto create(PartnershipMeetingDto dto) {
        PartnershipMeeting entity = partnershipMeetingMapper.toEntity(dto);
        entity.setMeetingId(null);
        return partnershipMeetingMapper.toDto(partnershipMeetingRepository.save(entity));
    }

    public PartnershipMeetingDto update(Long id, PartnershipMeetingDto dto) {
        findEntity(id);
        PartnershipMeeting entity = partnershipMeetingMapper.toEntity(dto);
        entity.setMeetingId(id);
        return partnershipMeetingMapper.toDto(partnershipMeetingRepository.save(entity));
    }

    public void delete(Long id) {
        partnershipMeetingRepository.delete(findEntity(id));
    }

    private PartnershipMeeting findEntity(Long id) {
        return partnershipMeetingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("PartnershipMeeting not found: " + id));
    }
}
