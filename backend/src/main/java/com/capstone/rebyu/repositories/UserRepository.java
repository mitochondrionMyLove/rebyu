package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
