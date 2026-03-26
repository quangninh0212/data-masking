package com.nhom.backend.service;

import com.nhom.backend.dto.auth.ChangeLoginPasswordRequest;
import com.nhom.backend.dto.auth.LoginRequest;
import com.nhom.backend.dto.auth.LoginResponse;
import com.nhom.backend.dto.auth.RegisterRequest;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.exception.BadRequestException;
import com.nhom.backend.exception.UnauthorizedException;
import com.nhom.backend.repository.UserRepository;
import com.nhom.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public AuthService(UserRepository userRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder,
                       AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    public void register(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new BadRequestException("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);
            auditLogService.save(
                user.getUsername(),
                "REGISTER",
                "USER",
                user.getId(),
                "Register new account"
        );
    }

    public LoginResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = jwtService.generateToken(user);
            auditLogService.save(
                    user.getUsername(),
                    "LOGIN",
                    "USER",
                    user.getId(),
                    "User login"
            );
        return new LoginResponse(token, user.getUsername(), user.getRole());
    }

    public void changeLoginPassword(UserEntity currentUser, ChangeLoginPasswordRequest request) {
        if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
            throw new BadRequestException("Old password is required");
        }
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new BadRequestException("New password is required");
        }
        if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
            auditLogService.save(
                    currentUser.getUsername(),
                    "CHANGE_LOGIN_PASSWORD",
                    "USER",
                    currentUser.getId(),
                    "Change login password"
            );
    }
}