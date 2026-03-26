package com.nhom.backend.service;

import com.nhom.backend.entity.AuditLogEntity;
import com.nhom.backend.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void save(String username, String action, String entityName, Long entityId, String description) {
        AuditLogEntity log = new AuditLogEntity();
        log.setUsername(username);
        log.setAction(action);
        log.setEntityName(entityName);
        log.setEntityId(entityId);
        log.setDescription(description);
        log.setCreatedAt(LocalDateTime.now().toString());
        auditLogRepository.save(log);
    }
}