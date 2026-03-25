package com.nhom.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "employees_information")
@Getter
@Setter
public class EmployeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "deleted_at", length = 255)
    private String deletedAt;

    @Column(name = "created_at", length = 255)
    private String createdAt;

    @Column(name = "updated_at", length = 255)
    private String updatedAt;

    @Column(unique = true, nullable = false, length = 255)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 255)
    private String gender;

    @Column(name = "date_of_birth", length = 255)
    private String dateOfBirth;

    @Column(name = "probationary_start_date", length = 255)
    private String probationaryStartDate;

    @Column(name = "probationary_end_date", length = 255)
    private String probationaryEndDate;

    @Column(name = "official_start_date", length = 255)
    private String officialStartDate;

    @Column(length = 255)
    private String type;

    @Column(length = 255)
    private String level;

    @Column(length = 255)
    private String education;

    @Column(name = "graduation_year", length = 255)
    private String graduationYear;

    @Lob
    @Column(name = "email_enc")
    private String emailEnc;

    @Lob
    @Column(name = "tax_code_enc")
    private String taxCodeEnc;

    @Lob
    @Column(name = "social_insurance_code_enc")
    private String socialInsuranceCodeEnc;

    @Lob
    @Column(name = "phone_number_enc")
    private String phoneNumberEnc;

    @Lob
    @Column(name = "citizen_identification_code_enc")
    private String citizenIdentificationCodeEnc;

    @Lob
    @Column(name = "personal_email_enc")
    private String personalEmailEnc;

    @Lob
    @Column(name = "birthplace_enc")
    private String birthplaceEnc;

    @Lob
    @Column(name = "current_address_enc")
    private String currentAddressEnc;

    @Lob
    @Column(name = "permanent_address_enc")
    private String permanentAddressEnc;

    @Lob
    @Column(name = "bank_name_enc")
    private String bankNameEnc;

    @Lob
    @Column(name = "bank_account_number_enc")
    private String bankAccountNumberEnc;

    @Column(name = "data_password_hash", nullable = false, length = 500)
    private String dataPasswordHash;

    @Column(name = "data_salt", nullable = false, length = 500)
    private String dataSalt;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;
}