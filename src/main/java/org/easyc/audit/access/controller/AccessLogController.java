package org.easyc.audit.access.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.audit.access.dto.AccessLogResponseDto;
import org.easyc.audit.access.dto.AccessLogSearchCondition;
import org.easyc.audit.access.service.AccessLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 접근 로그 REST API 컨트롤러
 *
 * 프론트엔드(Next.js)에서 호출하는 JSON API이다.
 * Thymeleaf 화면용 AccessLogController와 역할이 다르므로 분리한다.
 * ADMIN 권한이 있어야 접근 가능하다. (SecurityConfig - /api/admin/** 참고)
 */
@RestController
@RequestMapping("/api/access-logs")
@RequiredArgsConstructor
public class AccessLogController {

    private final AccessLogService accessLogService;

    /**
     * 접근 로그 목록 조회 (페이징)
     *
     * @param cond 검색 조건
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지당 건수 (기본 50)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<AccessLogResponseDto> getAccessLogs(
            @ModelAttribute AccessLogSearchCondition cond,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return accessLogService.search(cond, PageRequest.of(page, size));
    }
}
