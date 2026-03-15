package org.easyc.audit.activity.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseLogEntity;

@Entity
@Table(name = "activity_log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@SuperBuilder
public class ActivityLog extends BaseLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 행위 정의
    @Column(length = 100)
    private String actionCode;     // 예: ASSET_UPDATE

    @Column(length = 200)
    private String actionName;     // 예: "자산 수정"

    // 대상(옵션)
    @Column(length = 50)
    private String targetType;     // 예: ASSET, APPROVAL

    @Column(length = 100)
    private String targetId;       // 예: "123" (범용 문자열)

    // 요청 추적(옵션)
    @Column(length = 100)
    private String requestId;

    @Column(length = 45)
    private String ip;

    @Column(length = 1000)
    private String userAgent;

    // 결과
    @Column(length = 1)
    private String result;         // S / F

    private Integer status;        // HTTP 상태코드 (200, 400, 500 등)

    @Column(length = 2000)
    private String message;        // ApiResponse.message 또는 예외 메시지
}