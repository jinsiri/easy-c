package org.easyc.audit.activity;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.easyc.audit.activity.annotation.AuditAction;
import org.easyc.audit.activity.entity.ActivityLog;
import org.easyc.audit.activity.repository.ActivityLogRepository;
import org.easyc.audit.support.RequestAuditUtils;
import org.easyc.common.exception.CustomException;
import org.easyc.common.response.ApiResponse;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Aspect
@RequiredArgsConstructor
public class AuditAspect {

    private final ActivityLogRepository activityLogRepository;

    @Around("@annotation(auditAction)")
    public Object around(ProceedingJoinPoint joinPoint, AuditAction auditAction) throws Throwable {

        HttpServletRequest req = RequestAuditUtils.currentRequestOrNull();

        String requestId = RequestAuditUtils.resolveRequestId(req);
        String ip        = RequestAuditUtils.resolveIp(req);
        String ua        = RequestAuditUtils.resolveUserAgent(req);
        String targetId  = resolveTargetId(joinPoint.getArgs());

        String result     = "S";
        int    statusCode = 200;
        String message    = "OK";

        try {
            Object ret = joinPoint.proceed();

            if (ret instanceof ApiResponse<?> api) {
                result  = api.result();
                message = api.message();
                statusCode = parseStatus(api.status());
            }

            safeSave(auditAction, targetId, requestId, ip, ua, result, statusCode, message);
            return ret;

        } catch (Exception e) {
            result     = "F";
            statusCode = resolveStatusCode(e);
            message    = (e.getMessage() != null) ? e.getMessage() : e.getClass().getSimpleName();

            safeSave(auditAction, targetId, requestId, ip, ua, result, statusCode, message);
            throw e;
        }
    }

    /**
     * 로그 저장 실패가 비즈니스 로직에 영향을 주지 않도록 try-catch로 감쌌다.
     * 저장 실패 시 warn 로그만 남기고 무시한다.
     */
    private void safeSave(AuditAction a, String targetId, String requestId,
                          String ip, String ua, String result, int statusCode, String message) {
        try {
            ActivityLog log = ActivityLog.builder()
                    .registerIp(ip)
                    .actionCode(a.code())
                    .actionName(a.name())
                    .targetType(a.targetType())
                    .targetId(targetId)
                    .requestId(requestId)
                    .ip(ip)
                    .userAgent(ua)
                    .result(result)
                    .status(statusCode)
                    .message(message)
                    .build();

            activityLogRepository.save(log);

        } catch (Exception e) {
            log.warn("[AuditAspect] 활동 로그 저장 실패 - action: {}, error: {}", a.code(), e.getMessage());
        }
    }

    /**
     * CustomException이면 정의된 HTTP 상태코드를 사용하고,
     * 그 외 예외는 500으로 처리한다.
     */
    private int resolveStatusCode(Exception e) {
        if (e instanceof CustomException ce) {
            return ce.getHttpStatus().value();
        }
        return 500;
    }

    /**
     * ApiResponse.status()는 "200" 같은 문자열이므로 int로 변환한다.
     * 파싱 실패 시 200으로 fallback한다.
     */
    private int parseStatus(String status) {
        try {
            return Integer.parseInt(status);
        } catch (NumberFormatException e) {
            return 200;
        }
    }

    /**
     * args 중 Long/Integer 타입 첫 번째를 targetId로 추출한다.
     * String 파라미터는 제외한다 (이름, 코드 등 비-ID 문자열과 구분 불가).
     */
    private String resolveTargetId(Object[] args) {
        if (args == null) return null;

        for (Object arg : args) {
            if (arg instanceof Long l)    return String.valueOf(l);
            if (arg instanceof Integer i) return String.valueOf(i);
        }
        return null;
    }
}
