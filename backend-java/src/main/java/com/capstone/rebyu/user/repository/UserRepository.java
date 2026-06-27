package com.capstone.rebyu.user.repository;

import com.capstone.rebyu.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
