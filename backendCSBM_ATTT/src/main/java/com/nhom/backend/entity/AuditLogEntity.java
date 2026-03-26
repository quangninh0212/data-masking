package com.nhom.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
public class AuditLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", length = 255)
    private String username;

    @Column(name = "action", length = 255)
    private String action;

    @Column(name = "entity_name", length = 255)
    private String entityName;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "created_at", length = 255)
    private String createdAt;
}