package org.easyc.common.audit.activity;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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

    private final ActivityLogRepository activityLogRepository;

    /**
     * 활동 로그 목록 조회 (페이징)
     *
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지당 건수 (기본 200)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<ActivityLogResponseDto> getActivityLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size
    ) {
        return activityLogRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "registerDate"))
        ).map(ActivityLogResponseDto::from);
    }
}
