package org.easyc.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    // --- 공통 상태 (Common) ---
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    // --- 등록 정보 (Register) ---
    @CreatedDate
    @Column(name = "register_date")
    private LocalDateTime registerDate;

    @Column(name = "register_ip")
    private String registerIp;

    @Column(name = "register_id")
    private String registerId;

    @Column(name = "register_nm")
    private String registerNm;

    // --- 수정 정보 (Last Update) ---
    @LastModifiedDate
    @Column(name = "last_update_date")
    private LocalDateTime lastUpdateDate;

    @Column(name = "last_update_ip")
    private String lastUpdateIp;

    @Column(name = "last_update_id")
    private String lastUpdateId;

    @Column(name = "last_update_nm")
    private String lastUpdateNm;
}
