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

/**
 * 로그 전용 베이스 엔티티
 *
 * - 로그 테이블에서 공통으로 사용하는 등록 정보만 제공한다.
 * - @CreatedDate/@CreatedBy를 통해 registerDate/registerUser를 자동 기록한다.
 * - registerIp는 자동화가 어려워(요청 컨텍스트 필요) 인터셉터/AOP 등에서 직접 주입한다.
 */
@Getter
@SuperBuilder
@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseLogEntity {

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

}
