package com.nhom.backend.service;

import com.nhom.backend.dto.file.FileUploadResponse;
import com.nhom.backend.entity.EmployeeEntity;
import com.nhom.backend.entity.FileUploadEntity;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.exception.BadRequestException;
import com.nhom.backend.exception.ResourceNotFoundException;
import com.nhom.backend.repository.EmployeeRepository;
import com.nhom.backend.repository.FileUploadRepository;
import com.nhom.backend.util.AesCore;
import com.nhom.backend.util.Pbkdf2Core;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class FileStorageService {

    private final EmployeeRepository employeeRepository;
    private final FileUploadRepository fileUploadRepository;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Value("${app.encrypted-dir}")
    private String encryptedDir;

    @Value("${app.decrypted-dir}")
    private String decryptedDir;

    public FileStorageService(EmployeeRepository employeeRepository,
                              FileUploadRepository fileUploadRepository) {
        this.employeeRepository = employeeRepository;
        this.fileUploadRepository = fileUploadRepository;
    }

    public FileUploadResponse upload(UserEntity currentUser, MultipartFile file, String dataPassword) throws Exception {
        EmployeeEntity employee = employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        if (!Pbkdf2Core.verifyPassword(dataPassword, employee.getDataPasswordHash())) {
            throw new BadRequestException("Data password is incorrect");
        }

        Files.createDirectories(Paths.get(uploadDir));
        Files.createDirectories(Paths.get(encryptedDir));

        byte[] salt = Base64.getDecoder().decode(employee.getDataSalt());
        byte[] aesKey = Pbkdf2Core.deriveKey(dataPassword, salt, 10000, 16);

        String originalFileName = file.getOriginalFilename();
        String rawName = System.currentTimeMillis() + "_" + originalFileName;
        Path rawPath = Paths.get(uploadDir, rawName);
        Files.copy(file.getInputStream(), rawPath, StandardCopyOption.REPLACE_EXISTING);

        String encryptedName = rawName + ".enc";
        Path encryptedPath = Paths.get(encryptedDir, encryptedName);

        AesCore.encryptFile(rawPath, encryptedPath, aesKey);

        FileUploadEntity entity = new FileUploadEntity();
        entity.setFileName(encryptedName);
        entity.setOriginalFileName(originalFileName);
        entity.setStoredPath(encryptedPath.toString());
        entity.setEmployee(employee);
        entity.setIsEncrypted(true);
        entity.setCreatedAt(LocalDateTime.now().toString());
        entity.setUpdatedAt(LocalDateTime.now().toString());

        FileUploadEntity saved = fileUploadRepository.save(entity);

        return new FileUploadResponse(
                saved.getId(),
                saved.getFileName(),
                saved.getOriginalFileName(),
                saved.getIsEncrypted(),
                saved.getStoredPath()
        );
    }

    public List<FileUploadEntity> getMyFiles(UserEntity currentUser) {
        EmployeeEntity employee = employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
        return fileUploadRepository.findByEmployee(employee);
    }

    public String decryptFile(UserEntity currentUser, Long fileId, String dataPassword) throws Exception {
        EmployeeEntity employee = employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        FileUploadEntity fileUpload = fileUploadRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        if (!fileUpload.getEmployee().getId().equals(employee.getId())) {
            throw new BadRequestException("You cannot access this file");
        }

        if (!Pbkdf2Core.verifyPassword(dataPassword, employee.getDataPasswordHash())) {
            throw new BadRequestException("Data password is incorrect");
        }

        Files.createDirectories(Paths.get(decryptedDir));

        byte[] salt = Base64.getDecoder().decode(employee.getDataSalt());
        byte[] aesKey = Pbkdf2Core.deriveKey(dataPassword, salt, 10000, 16);

        Path inputPath = Paths.get(fileUpload.getStoredPath());
        Path outputPath = Paths.get(decryptedDir, "decrypted_" + fileUpload.getOriginalFileName());

        AesCore.decryptFile(inputPath, outputPath, aesKey);

        return outputPath.toString();
    }
}