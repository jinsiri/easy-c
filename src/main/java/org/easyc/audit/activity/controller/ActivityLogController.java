package org.easyc.audit.activity.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.audit.activity.dto.ActivityLogResponseDto;
import org.easyc.audit.activity.dto.ActivityLogSearchCondition;
import org.easyc.audit.activity.service.ActivityLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 활동 로그 REST API 컨트롤러
 *
 * @AuditAction 이 붙은 서비스 메서드 호출 결과를 저장한 로그를 조회한다.
 * ADMIN 권한이 있어야 접근 가능하다.
 */
@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    /**
     * 활동 로그 목록 조회 (페이징)
     *
     * @param cond 검색조건
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지당 건수 (기본 200)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<ActivityLogResponseDto> getActivityLogs(
            @ModelAttribute ActivityLogSearchCondition cond,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return activityLogService.search(cond, PageRequest.of(page, size));
    }
}
