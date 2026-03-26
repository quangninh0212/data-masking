package com.nhom.backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeDataPasswordRequest {
    private String oldDataPassword;
    private String newDataPassword;
}