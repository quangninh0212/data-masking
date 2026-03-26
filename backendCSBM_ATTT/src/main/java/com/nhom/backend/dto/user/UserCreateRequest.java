package com.nhom.backend.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateRequest {
    private String username;
    private String password;
    private String role;
}