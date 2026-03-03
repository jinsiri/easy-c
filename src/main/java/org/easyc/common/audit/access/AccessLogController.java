package org.easyc.common.audit.access;

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

    private final AccessLogRepository accessLogRepository;

    /**
     * 접근 로그 목록 조회 (페이징)
     *
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지당 건수 (기본 200)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<AccessLogResponseDto> getAccessLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size
    ) {
        return accessLogRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "registerDate"))
        ).map(AccessLogResponseDto::from);
    }
}
