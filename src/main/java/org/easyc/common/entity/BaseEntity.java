package org.easyc.common.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.AuditUser;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
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

    @Builder.Default
    @Column(name = "active", nullable = false)
    private boolean active = true;

    // --- 등록 정보 (Register) ---
    @CreatedDate
    @Column(name = "register_date", updatable = false)
    private LocalDateTime registerDate;

    @Column(name = "register_ip", updatable = false)
    private String registerIp;

    @CreatedBy
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "loginId", column = @Column(name = "register_id", updatable = false)),
            @AttributeOverride(name = "memberNm", column = @Column(name = "register_nm", updatable = false)),
            @AttributeOverride(name = "memberRole", column = @Column(name = "register_role", updatable = false))
    })
    private AuditUser registerUser;

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

//    @Column(name = "last_update_id")
//    private String lastUpdateId;
//
//    @Column(name = "last_update_nm")
//    private String lastUpdateNm;

    @LastModifiedBy
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "loginId", column = @Column(name = "last_update_id", updatable = false)),
            @AttributeOverride(name = "memberNm", column = @Column(name = "last_update_nm", updatable = false)),
            @AttributeOverride(name = "memberRole", column = @Column(name = "last_update_role", updatable = false))
    })
    private AuditUser lastUpdateUser;

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
