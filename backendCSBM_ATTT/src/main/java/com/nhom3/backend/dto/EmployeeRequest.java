package com.nhom3.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeRequest {
    private String employeeCode;
    private String fullName;
    private String cccd;
    private String phone;
    private String email;
    private String address;
    private String bankAccount;
    private String salary;
    private Long departmentId;
    private Long positionId;
}
