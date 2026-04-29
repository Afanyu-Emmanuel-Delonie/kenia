package com.auca.kenia.repository;

import com.auca.kenia.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/** Repository Pattern: abstracts all User persistence operations. */
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);
}
