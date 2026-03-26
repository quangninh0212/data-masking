package com.nhom.backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeLoginPasswordRequest {
    private String oldPassword;
    private String newPassword;
}