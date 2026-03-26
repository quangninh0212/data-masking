package com.nhom.backend.controller;

import com.nhom.backend.dto.auth.ChangeLoginPasswordRequest;
import com.nhom.backend.dto.auth.LoginRequest;
import com.nhom.backend.dto.auth.LoginResponse;
import com.nhom.backend.dto.auth.RegisterRequest;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(Map.of("message", "Register success"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @RequestBody ChangeLoginPasswordRequest request
    ) {
        authService.changeLoginPassword(currentUser, request);
        return ResponseEntity.ok(Map.of("message", "Change login password success"));
    }
}