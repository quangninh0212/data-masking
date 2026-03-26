package com.nhom.backend.dto.employee;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeSearchRequest {
    private String code;
    private String name;
    private String gender;
    private String type;
    private String level;
    private String education;
    private String graduationYear;
}