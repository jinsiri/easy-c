package org.easyc.audit.security.dto;

import lombok.Builder;
import lombok.Getter;
import org.easyc.audit.security.entity.SecurityLog;

import java.time.LocalDateTime;

@Getter
@Builder
public class SecurityLogResponseDto {

    private Long id;
    private LocalDateTime registerDate;

    private String eventType;  // LOGIN_SUCCESS / LOGIN_FAILURE / ACCESS_DENIED
    private String loginId;
    private String ip;
    private String userAgent;
    private String uri;
    private String detail;
    private String requestId;

    public static SecurityLogResponseDto from(SecurityLog log) {
        return SecurityLogResponseDto.builder()
                .id(log.getId())
                .registerDate(log.getRegisterDate())
                .eventType(log.getEventType())
                .loginId(log.getLoginId())
                .ip(log.getIp())
                .userAgent(log.getUserAgent())
                .uri(log.getUri())
                .detail(log.getDetail())
                .requestId(log.getRequestId())
                .build();
    }
}
