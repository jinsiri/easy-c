package org.easyc.audit.security.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseLogEntity;

@Entity
@Table(name = "security_log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@SuperBuilder
public class SecurityLog extends BaseLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 이벤트 유형
    @Column(length = 30, nullable = false)
    private String eventType;      // SecurityEventType.name()

    // 행위자 (로그인 시도한 ID, @CreatedBy는 보안 이벤트 시점에 null일 수 있어서 별도 저장)
    @Column(length = 100)
    private String loginId;        // 시도한 loginId (실패 시에도 기록)

    // 요청 추적
    @Column(length = 100)
    private String requestId;      // 접근 로그와 동일 requestId (연결 가능)

    @Column(length = 45)
    private String ip;

    @Column(length = 1000)
    private String userAgent;

    // 컨텍스트
    @Column(length = 500)
    private String uri;            // 인가 거부 시 접근 시도한 URL

    @Column(length = 500)
    private String detail;         // 실패 이유 (BadCredentials, DisabledException 등)

    @Column(length = 20)
    private String deviceType;     // MOBILE / DESKTOP / UNKNOWN
}
