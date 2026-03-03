package org.easyc.common.audit.access;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseLogEntity;

/**
 * 접근(접속) 로그 엔티티
 *
 * 목적:
 * - 모든 HTTP 요청/응답의 흔적을 남겨 장애 분석, 보안 감사, 트래픽 추적에 활용한다.
 *
 * 특징:
 * - append-only 로그(수정/삭제 개념 없음)
 * - 등록 정보(registerDate/registerUser/registerIp)는 BaseLogEntity에서 Auditing으로 자동 처리된다.
 *
 * 참고:
 * - registerUser는 @CreatedBy(AuditorAware 구현)에 의해 인증 사용자 정보가 자동 저장된다.
 * - 비인증 요청(로그인 전, permitAll)은 registerUser가 null일 수 있다.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@SuperBuilder
public class AccessLog extends BaseLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- 요청 정보 ---
    private String method;          // HTTP 메서드 (GET, POST, PUT, DELETE 등)
    private String uri;             // 요청 경로 (/api/members/1 등, 쿼리스트링 미포함)

    @Column(length = 2000)
    private String queryString;     // 쿼리 파라미터 (?page=0&size=30 등), 없으면 null

    /** 상관관계 추적용 */
    private String requestId;

    /** 화면 이동 추적용 */
    @Column(length = 2000)
    private String referer;

    private String ip;              // 클라이언트 IP (프록시 경유 시 X-Forwarded-For 헤더 우선)
    @Column(length = 1000)
    private String userAgent;       // 브라우저/기기 정보

    /** MOBILE/DESKTOP 간단 분류 */
    private String deviceType;

    // --- 응답 정보 ---
    private Integer status;         // HTTP 응답 코드 (200, 401, 403, 500 등)
    private Long durationMs;        // 처리 시간 (밀리초)
    private boolean success;        // 응답 코드 400 미만이면 성공으로 판단
}