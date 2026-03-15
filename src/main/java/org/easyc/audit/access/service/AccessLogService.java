package org.easyc.audit.access.service;

import lombok.RequiredArgsConstructor;
import org.easyc.audit.access.dto.AccessLogResponseDto;
import org.easyc.audit.access.dto.AccessLogSearchCondition;
import org.easyc.audit.access.repository.AccessLogRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccessLogService {

    private final AccessLogRepositoryCustom accessLogRepositoryCustom;

    public Page<AccessLogResponseDto> search(AccessLogSearchCondition cond, Pageable pageable) {
        return accessLogRepositoryCustom.search(cond, pageable).map(AccessLogResponseDto::from);
    }
}
