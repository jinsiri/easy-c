package org.easyc.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseUserDto;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@SuperBuilder
@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    // --- 공통 상태 (Common) ---
    @Builder.Default
    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

    @Column(name = "active")
    private boolean active = true;

    // --- 등록 정보 (Register) ---
    @CreatedDate
    @Column(name = "register_date", updatable = false)
    private LocalDateTime registerDate;

    @Column(name = "register_ip", updatable = false)
    private String registerIp;

    @CreatedBy
    @Embedded
    private BaseUserDto registerUser;

   /* @Column(name = "register_id", updatable = false)
    private String registerId;

    @Column(name = "register_nm", updatable = false)
    private String registerNm;*/

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

    public void delete() {
        this.deleted = true;
        this.active = false;
    }

    public void restore() {
        this.deleted = false;
        this.active = true;
    }

    public void activate() {
        this.active = true;
    }

    public void deactivate() {
        this.active = false;
    }
}
