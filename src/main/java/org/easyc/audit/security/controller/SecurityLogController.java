package org.easyc.audit.security.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.audit.security.dto.SecurityLogResponseDto;
import org.easyc.audit.security.dto.SecurityLogSearchCondition;
import org.easyc.audit.security.service.SecurityLogService;
import org.easyc.common.dto.AuditUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/security-logs")
@RequiredArgsConstructor
public class SecurityLogController {

    private final SecurityLogService securityLogService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<SecurityLogResponseDto> getSecurityLogs(
            @ModelAttribute SecurityLogSearchCondition cond,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return securityLogService.search(cond, PageRequest.of(page, size));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/recent-logins")
    public List<SecurityLogResponseDto> getRecentLogins(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return securityLogService.getRecentLogins(limit);
    }

    @GetMapping("/my-logins")
    public List<SecurityLogResponseDto> getMyLogins(
            @AuthenticationPrincipal AuditUser user,
            @RequestParam(defaultValue = "5") int limit
    ) {
        return securityLogService.getMyLogins(user.getLoginId(), limit);
    }
}
