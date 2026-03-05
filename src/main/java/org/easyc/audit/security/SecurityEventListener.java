package org.easyc.audit.security;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.audit.security.constant.SecurityEventType;
import org.easyc.audit.security.entity.SecurityLog;
import org.easyc.audit.security.repository.SecurityLogRepository;
import org.easyc.audit.support.RequestAuditUtils;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.authorization.event.AuthorizationDeniedEvent;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 * Spring Security 보안 이벤트 리스너
 *
 * Spring Security 레이어에서 발생하는 이벤트를 수신해 SecurityLog로 저장한다.
 * - 인터셉터(접근 로그)는 DispatcherServlet 이후 레이어라 Security 거부 이벤트를 잡을 수 없다.
 * - 이벤트 리스너는 Security 레이어 이벤트를 직접 수신하므로 보안 로그에 적합하다.
 *
 * 처리 이벤트:
 * - AuthenticationSuccessEvent  : 로그인 성공
 * - AbstractAuthenticationFailureEvent : 로그인 실패 (BadCredentials, AccountLocked 등)
 * - AuthorizationDeniedEvent    : 인가 거부 (403 - 권한 없는 접근)
 *
 * AuthorizationDeniedEvent 활성화를 위해 SecurityConfig에
 * SpringAuthorizationEventPublisher 빈이 등록되어야 한다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SecurityEventListener {

    private final SecurityLogRepository securityLogRepository;

    @EventListener
    public void onLoginSuccess(AuthenticationSuccessEvent event) {
        Authentication auth = event.getAuthentication();
        HttpServletRequest req = RequestAuditUtils.currentRequestOrNull();

        safeSave(SecurityLog.builder()
                .registerIp(RequestAuditUtils.resolveIp(req))
                .eventType(SecurityEventType.LOGIN_SUCCESS.name())
                .loginId(auth.getName())
                .requestId(RequestAuditUtils.resolveRequestId(req))
                .ip(RequestAuditUtils.resolveIp(req))
                .userAgent(RequestAuditUtils.resolveUserAgent(req))
                .uri(req != null ? req.getRequestURI() : null)
                .detail(null)
                .build());
    }

    @EventListener
    public void onLoginFailure(AbstractAuthenticationFailureEvent event) {
        Authentication auth = event.getAuthentication();
        HttpServletRequest req = RequestAuditUtils.currentRequestOrNull();

        // 시도한 loginId는 principal에 담겨 있음 (UsernamePasswordAuthenticationToken)
        Object principal = auth.getPrincipal();
        String loginId = principal instanceof String s ? s : auth.getName();

        String detail = event.getException().getClass().getSimpleName()
                + ": " + event.getException().getMessage();

        safeSave(SecurityLog.builder()
                .registerIp(RequestAuditUtils.resolveIp(req))
                .eventType(SecurityEventType.LOGIN_FAILURE.name())
                .loginId(loginId)
                .requestId(RequestAuditUtils.resolveRequestId(req))
                .ip(RequestAuditUtils.resolveIp(req))
                .userAgent(RequestAuditUtils.resolveUserAgent(req))
                .uri(req != null ? req.getRequestURI() : null)
                .detail(detail)
                .build());
    }

    @EventListener
    public void onAccessDenied(AuthorizationDeniedEvent<?> event) {
        Authentication auth = event.getAuthentication().get();
        HttpServletRequest req = RequestAuditUtils.currentRequestOrNull();

        // 비인증 사용자(AnonymousAuthenticationToken)는 loginId null 처리
        String loginId = (auth instanceof AnonymousAuthenticationToken) ? null : auth.getName();

        safeSave(SecurityLog.builder()
                .registerIp(RequestAuditUtils.resolveIp(req))
                .eventType(SecurityEventType.ACCESS_DENIED.name())
                .loginId(loginId)
                .requestId(RequestAuditUtils.resolveRequestId(req))
                .ip(RequestAuditUtils.resolveIp(req))
                .userAgent(RequestAuditUtils.resolveUserAgent(req))
                .uri(req != null ? req.getRequestURI() : null)
                .detail(null)
                .build());
    }

    private void safeSave(SecurityLog securityLog) {
        try {
            securityLogRepository.save(securityLog);
        } catch (Exception e) {
            log.warn("[SecurityEventListener] 보안 로그 저장 실패 - type: {}, error: {}",
                    securityLog.getEventType(), e.getMessage());
        }
    }
}
