package com.nhom.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "files_uploading")
@Getter
@Setter
public class FileUploadEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "deleted_at", length = 255)
    private String deletedAt;

    @Column(name = "created_at", length = 255)
    private String createdAt;

    @Column(name = "updated_at", length = 255)
    private String updatedAt;

    @Column(name = "file_name", length = 500)
    private String fileName;

    @Column(name = "stored_path", length = 1000)
    private String storedPath;

    @Column(name = "original_file_name", length = 500)
    private String originalFileName;

    @Column(name = "is_encrypted")
    private Boolean isEncrypted;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private EmployeeEntity employee;
}