package com.nhom.backend.repository;

import com.nhom.backend.entity.EmployeeEntity;
import com.nhom.backend.entity.UserEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {
    Optional<EmployeeEntity> findByUser(UserEntity user);
    boolean existsByCode(String code);
}