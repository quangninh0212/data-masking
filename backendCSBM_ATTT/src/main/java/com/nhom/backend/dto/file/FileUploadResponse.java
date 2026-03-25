package com.nhom.backend.dto.file;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FileUploadResponse {
    private Long id;
    private String fileName;
    private String originalFileName;
    private Boolean isEncrypted;
    private String storedPath;
}