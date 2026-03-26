package com.nhom.backend.dto.file;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FileDecryptResponse {
    private Long fileId;
    private String outputPath;
    private String message;
}