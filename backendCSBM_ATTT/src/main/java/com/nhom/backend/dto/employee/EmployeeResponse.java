package com.nhom.backend.dto.employee;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeResponse {
    private Long id;
    private String code;
    private String name;
    private String gender;
    private String dateOfBirth;
    private String probationaryStartDate;
    private String probationaryEndDate;
    private String officialStartDate;
    private String type;
    private String level;
    private String graduationYear;
    private String education;

    private String email;
    private String taxCode;
    private String socialInsuranceCode;
    private String phoneNumber;
    private String citizenIdentificationCode;
    private String personalEmail;
    private String birthplace;
    private String currentAddress;
    private String permanentAddress;
    private String bankName;
    private String bankAccountNumber;

    private boolean unlocked;
}