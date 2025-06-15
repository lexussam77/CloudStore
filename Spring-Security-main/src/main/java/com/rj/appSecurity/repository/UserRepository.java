package com.rj.appSecurity.repository;

import com.rj.appSecurity.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByEmailIgnoreCase(String email);
    Optional<UserEntity> findByUserId(String userId);
    Optional<UserEntity> findUserEntityByUserId(String userId);

    Optional<UserEntity> findByUsername(String username);
}
