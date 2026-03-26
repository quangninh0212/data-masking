package com.nhom.backend.controller;

import com.nhom.backend.entity.AuditLogEntity;
import com.nhom.backend.exception.ResourceNotFoundException;
import com.nhom.backend.repository.AuditLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * API cho admin xem toàn bộ audit log
     */
    @GetMapping
    public ResponseEntity<List<AuditLogEntity>> getAllLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }

    /**
     * API cho admin xem chi tiết 1 audit log theo id
     */
    @GetMapping("/{id}")
    public ResponseEntity<AuditLogEntity> getLogById(@PathVariable Long id) {
        AuditLogEntity log = auditLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Audit log not found"));
        return ResponseEntity.ok(log);
    }
}