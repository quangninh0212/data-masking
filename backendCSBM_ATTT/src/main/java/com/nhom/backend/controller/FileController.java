package com.nhom.backend.controller;

import com.nhom.backend.dto.file.FileUploadResponse;
import com.nhom.backend.entity.FileUploadEntity;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> upload(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @RequestParam("file") MultipartFile file,
            @RequestParam("dataPassword") String dataPassword
    ) throws Exception {
        return ResponseEntity.ok(fileStorageService.upload(currentUser, file, dataPassword));
    }

    @GetMapping("/my-files")
    public ResponseEntity<List<FileUploadEntity>> getMyFiles(
            @RequestAttribute("currentUser") UserEntity currentUser
    ) {
        return ResponseEntity.ok(fileStorageService.getMyFiles(currentUser));
    }

    @PostMapping("/decrypt/{fileId}")
    public ResponseEntity<?> decrypt(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @PathVariable Long fileId,
            @RequestParam("dataPassword") String dataPassword
    ) throws Exception {
        String outputPath = fileStorageService.decryptFile(currentUser, fileId, dataPassword);
        return ResponseEntity.ok(Map.of("message", "Decrypt success", "outputPath", outputPath));
    }
}