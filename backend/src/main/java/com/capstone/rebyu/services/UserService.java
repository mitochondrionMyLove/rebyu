package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.UserDto;
import com.capstone.rebyu.mappers.UserMapper;
import com.capstone.rebyu.models.User;
import com.capstone.rebyu.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<UserDto> getAll() {
        return userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    public UserDto getById(Long id) {
        return userMapper.toDto(findEntity(id));
    }

    public UserDto create(UserDto dto) {
        User entity = userMapper.toEntity(dto);
        entity.setUserId(null);
        return userMapper.toDto(userRepository.save(entity));
    }

    public UserDto update(Long id, UserDto dto) {
        findEntity(id);
        User entity = userMapper.toEntity(dto);
        entity.setUserId(id);
        return userMapper.toDto(userRepository.save(entity));
    }

    public void delete(Long id) {
        userRepository.delete(findEntity(id));
    }

    private User findEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }
}
