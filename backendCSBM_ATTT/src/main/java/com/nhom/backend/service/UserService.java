package com.nhom.backend.service;

import com.nhom.backend.dto.auth.RegisterRequest;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public UserService(UserRepository userRepository,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    public UserEntity register(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new RuntimeException("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        UserEntity savedUser = userRepository.save(user);
        auditLogService.save(
                savedUser.getUsername(),
                "REGISTER",
                "USER",
                savedUser.getId(),
                "Register new account");
        return savedUser;
    }

}