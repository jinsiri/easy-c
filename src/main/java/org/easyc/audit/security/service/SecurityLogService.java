package org.easyc.audit.security.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.easyc.audit.security.constant.SecurityEventType;
import org.easyc.audit.security.dto.SecurityLogResponseDto;
import org.easyc.audit.security.dto.SecurityLogSearchCondition;
import org.easyc.audit.security.entity.SecurityLog;
import org.easyc.audit.security.repository.SecurityLogRepository;
import org.easyc.audit.security.repository.SecurityLogRepositoryCustom;
import org.easyc.audit.support.RequestAuditUtils;
import org.easyc.common.constant.DeviceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SecurityLogService {

    private final SecurityLogRepository securityLogRepository;
    private final SecurityLogRepositoryCustom securityLogRepositoryCustom;

    public Page<SecurityLogResponseDto> search(SecurityLogSearchCondition cond, Pageable pageable) {
        return securityLogRepositoryCustom.search(cond, pageable).map(SecurityLogResponseDto::from);
    }

    public List<SecurityLogResponseDto> getRecentLogins(int limit) {
        return securityLogRepository
                .findByEventTypeInOrderByRegisterDateDesc(
                        List.of("LOGIN_SUCCESS", "LOGIN_FAILURE"),
                        PageRequest.of(0, limit)
                )
                .stream()
                .map(SecurityLogResponseDto::from)
                .toList();
    }

    public void saveLogout(String loginId, HttpServletRequest req) {
        String userAgent = RequestAuditUtils.resolveUserAgent(req);
        String ua = userAgent == null ? null : userAgent.toLowerCase();
        String deviceType = ua == null ? DeviceType.UNKNOWN.name()
                : (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone"))
                ? DeviceType.MOBILE.name() : DeviceType.DESKTOP.name();

        securityLogRepository.save(SecurityLog.builder()
                .registerIp(RequestAuditUtils.resolveIp(req))
                .eventType(SecurityEventType.LOGOUT_SUCCESS.name())
                .loginId(loginId)
                .requestId(RequestAuditUtils.resolveRequestId(req))
                .ip(RequestAuditUtils.resolveIp(req))
                .userAgent(userAgent)
                .deviceType(deviceType)
                .uri(req.getRequestURI())
                .build());
    }

    public List<SecurityLogResponseDto> getMyLogins(String loginId, int limit) {
        return securityLogRepository
                .findByLoginIdAndEventTypeInOrderByRegisterDateDesc(
                        loginId,
                        List.of("LOGIN_SUCCESS", "LOGIN_FAILURE"),
                        PageRequest.of(0, limit)
                )
                .stream()
                .map(SecurityLogResponseDto::from)
                .toList();
    }
}
