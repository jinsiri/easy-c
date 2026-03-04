package org.easyc.common.audit.activity;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 활동 로그 REST API 응답 DTO
 *
 * BaseLogEntity.registerUser(embedded)를 flat하게 펼쳐서 반환한다.
 */
@Getter
@Builder
public class ActivityLogResponseDto {

    private Long id;

    // --- 행위자 정보 (BaseLogEntity.registerUser 플랫화) ---
    private LocalDateTime registerDate;
    private String loginId;     // registerUser.loginId
    private String memberNm;    // registerUser.memberNm
    private String memberRole;  // registerUser.memberRole (코드 그대로, FE에서 표시)

    // --- 행위 정의 ---
    private String actionCode;
    private String actionName;

    // --- 대상 ---
    private String targetType;
    private String targetId;

    // --- 요청 추적 ---
    private String requestId;
    private String ip;
    private String userAgent;

    // --- 결과 ---
    private String result;    // S / F
    private Integer status;   // HTTP 상태코드 (200, 400, 500 등)
    private String message;

    public static ActivityLogResponseDto from(ActivityLog log) {
        String loginId   = log.getRegisterUser() != null ? log.getRegisterUser().getLoginId()   : null;
        String memberNm  = log.getRegisterUser() != null ? log.getRegisterUser().getMemberNm()  : null;
        String memberRole = log.getRegisterUser() != null ? log.getRegisterUser().getMemberRole() : null;

        return ActivityLogResponseDto.builder()
                .id(log.getId())
                .registerDate(log.getRegisterDate())
                .loginId(loginId)
                .memberNm(memberNm)
                .memberRole(memberRole)
                .actionCode(log.getActionCode())
                .actionName(log.getActionName())
                .targetType(log.getTargetType())
                .targetId(log.getTargetId())
                .requestId(log.getRequestId())
                .ip(log.getIp())
                .userAgent(log.getUserAgent())
                .result(log.getResult())
                .status(log.getStatus())
                .message(log.getMessage())
                .build();
    }
}
