package com.capstone.rebyu.user.repository;

import com.capstone.rebyu.user.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserTypeRepository extends JpaRepository<UserType, Long> {

    Optional<UserType> findByUserTypeText(String userTypeText);
}
