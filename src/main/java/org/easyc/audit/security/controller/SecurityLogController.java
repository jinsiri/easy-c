package org.easyc.audit.security.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.audit.security.repository.SecurityLogRepository;
import org.easyc.audit.security.dto.SecurityLogResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.easyc.common.dto.AuditUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

/**
 * 보안 로그 REST API 컨트롤러
 *
 * Spring Security 이벤트(로그인 성공/실패, 인가 거부)를 기록한 로그를 조회한다.
 * ADMIN 권한이 있어야 접근 가능하다.
 */
@RestController
@RequestMapping("/api/security-logs")
@RequiredArgsConstructor
public class SecurityLogController {

    private final SecurityLogRepository securityLogRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<SecurityLogResponseDto> getSecurityLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size
    ) {
        return securityLogRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "registerDate"))
        ).map(SecurityLogResponseDto::from);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/recent-logins")
    public List<SecurityLogResponseDto> getRecentLogins(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return securityLogRepository
                .findByEventTypeInOrderByRegisterDateDesc(
                        List.of("LOGIN_SUCCESS", "LOGIN_FAILURE"),
                        PageRequest.of(0, limit)
                )
                .stream()
                .map(SecurityLogResponseDto::from)
                .toList();
    }

    @GetMapping("/my-logins")
    public List<SecurityLogResponseDto> getMyLogins(
            @AuthenticationPrincipal AuditUser user,
            @RequestParam(defaultValue = "5") int limit
    ) {
        return securityLogRepository
                .findByLoginIdAndEventTypeInOrderByRegisterDateDesc(
                        user.getLoginId(),
                        List.of("LOGIN_SUCCESS", "LOGIN_FAILURE"),
                        PageRequest.of(0, limit)
                )
                .stream()
                .map(SecurityLogResponseDto::from)
                .toList();
    }
}
