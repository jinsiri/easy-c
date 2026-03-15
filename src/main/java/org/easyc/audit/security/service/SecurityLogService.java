package org.easyc.audit.security.service;

import lombok.RequiredArgsConstructor;
import org.easyc.audit.security.dto.SecurityLogResponseDto;
import org.easyc.audit.security.dto.SecurityLogSearchCondition;
import org.easyc.audit.security.repository.SecurityLogRepository;
import org.easyc.audit.security.repository.SecurityLogRepositoryCustom;
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
