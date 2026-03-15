package org.easyc.audit.access.dto;

import lombok.Builder;
import lombok.Getter;
import org.easyc.common.constant.DeviceType;
import org.easyc.audit.access.entity.AccessLog;
import org.easyc.common.support.EnumOptionMapper;
import org.easyc.member.constant.MemberRole;

import java.time.LocalDateTime;

/**
 * 접근 로그 REST API 응답 DTO
 *
 * AccessLog 엔티티의 BaseLogEntity.registerUser(embedded)를 flat하게 펼쳐서 반환한다.
 * 프론트엔드에서 log.loginId 형태로 바로 접근할 수 있도록 한다.
 */
@Getter
@Builder
public class AccessLogResponseDto {

    private Long id;

    // --- 행위자 정보 (BaseLogEntity.registerUser 플랫화) ---
    private LocalDateTime registerDate;
    private String loginId;     // registerUser.loginId
    private String memberNm;    // registerUser.memberNm
    private String memberRole;  // registerUser.memberRole

    // --- 요청 정보 ---
    private String method;
    private String uri;
    private String queryString;
    private String ip;
    private String userAgent;
    private String deviceType;

    // --- 응답 정보 ---
    private Integer status;
    private Long durationMs;
    private boolean success;

    public static AccessLogResponseDto from(AccessLog log) {
        String loginId = log.getRegisterUser() != null ? log.getRegisterUser().getLoginId() : null;
        String memberNm = log.getRegisterUser() != null ? log.getRegisterUser().getMemberNm() : null;
        String memberRoleCode = log.getRegisterUser() != null ? log.getRegisterUser().getMemberRole() : null;

        // String → Enum 변환 (알 수 없는 값이면 null 처리)
        MemberRole memberRole = toEnum(MemberRole.class, memberRoleCode);
        DeviceType deviceType = toEnum(DeviceType.class, log.getDeviceType());

        return AccessLogResponseDto.builder()
                .id(log.getId())
                .registerDate(log.getRegisterDate())
                .loginId(loginId)
                .memberNm(memberNm)
                .memberRole(EnumOptionMapper.getLabel(memberRole, "member.role"))
                .method(log.getMethod())
                .uri(log.getUri())
                .queryString(log.getQueryString())
                .ip(log.getIp())
                .userAgent(log.getUserAgent())
                .deviceType(EnumOptionMapper.getLabel(deviceType, "device.type"))
                .status(log.getStatus())
                .durationMs(log.getDurationMs())
                .success(log.isSuccess())
                .build();
    }

    /**
     * String 값을 안전하게 Enum으로 변환한다.
     * null이거나 매핑되지 않는 값이면 null을 반환한다.
     */
    private static <E extends Enum<E>> E toEnum(Class<E> enumClass, String value) {
        if (value == null) return null;
        try {
            return Enum.valueOf(enumClass, value);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
