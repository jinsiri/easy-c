package org.easyc.audit.activity.service;

import lombok.RequiredArgsConstructor;
import org.easyc.audit.activity.dto.ActivityLogResponseDto;
import org.easyc.audit.activity.dto.ActivityLogSearchCondition;
import org.easyc.audit.activity.repository.ActivityLogRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepositoryCustom activityLogRepositoryCustom;

    public Page<ActivityLogResponseDto> search(ActivityLogSearchCondition cond, Pageable pageable) {
        return activityLogRepositoryCustom.search(cond, pageable).map(ActivityLogResponseDto::from);
    }
}
