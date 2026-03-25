package com.nhom.backend.repository;

import com.nhom.backend.entity.EmployeeEntity;
import com.nhom.backend.entity.FileUploadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileUploadRepository extends JpaRepository<FileUploadEntity, Long> {
    List<FileUploadEntity> findByEmployee(EmployeeEntity employee);
}