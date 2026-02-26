package org.easyc.common.audit.access;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.UUID;

/**
 * 접근 로그 인터셉터
 *
 * - 모든 HTTP 요청에 대해 처리 시간/응답코드/IP/UA 등을 수집해 AccessLog로 저장한다.
 * - registerDate는 @CreatedDate로 자동 세팅되며, registerUser는 @CreatedBy(AuditorAware)로 세팅될 수 있다.
 * - registerIp는 request에서 직접 추출해 AccessLog.builder().registerIp(ip)로 주입한다.
 *
 * 흐름:
 * - preHandle: 시작 시간, requestId 준비
 * - afterCompletion: 응답 완료 후(예외 포함) 로그 저장
 */
@Component
@RequiredArgsConstructor
public class AccessLogInterceptor implements HandlerInterceptor {

    private static final String START_TIME_ATTR = "startTime";
    private static final String REQUEST_ID_ATTR = "requestId";

    private final AccessLogRepository accessLogRepository;

    /**
     * 요청 처리 전 실행
     * 처리 시간 측정을 위해 시작 시각을 request 속성에 저장한다.
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(START_TIME_ATTR, System.currentTimeMillis());

        // requestId 준비 (없으면 생성)
        String requestId = request.getHeader("X-Request-Id");
        if (requestId == null || requestId.isBlank()) {
            requestId = UUID.randomUUID().toString();
        }
        request.setAttribute(REQUEST_ID_ATTR, requestId);

        // 원하면 응답 헤더에도 내려줘서 FE/운영 추적 가능
        response.setHeader("X-Request-Id", requestId);

        return true;
    }

    /**
     * 요청 처리 완료 후 실행 (예외 발생 시에도 호출됨)
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {

        Object startObj = request.getAttribute(START_TIME_ATTR);
        long startTime = (startObj instanceof Long) ? (Long) startObj : System.currentTimeMillis();
        long durationMs = System.currentTimeMillis() - startTime;

        int status = response.getStatus();
        String ip = resolveIp(request);

        String userAgent = request.getHeader("User-Agent");
        String deviceType = resolveDeviceType(userAgent);

        String requestId = (String) request.getAttribute(REQUEST_ID_ATTR);
        String referer = request.getHeader("Referer");

        AccessLog log = AccessLog.builder()
                // BaseLogEntity fields
                .registerIp(ip)

                // request fields
                .method(request.getMethod())
                .uri(request.getRequestURI())
                .queryString(request.getQueryString())
                .requestId(requestId)
                .referer(referer)
                .ip(ip)
                .userAgent(userAgent)
                .deviceType(deviceType)

                // response fields
                .status(status)
                .durationMs(durationMs)
                .success(status < 400)
                .build();

        accessLogRepository.save(log);
    }

    /**
     * 실제 클라이언트 IP 추출
     * 로드 밸런서나 리버스 프록시(Nginx 등) 뒤에 서버가 있을 경우
     * 실제 클라이언트 IP는 X-Forwarded-For 헤더에 담겨 온다.
     * 여러 IP가 쉼표로 이어진 경우 맨 앞의 IP가 원래 클라이언트 IP이다.
     */
    private String resolveIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }


    /**
     * User-Agent 문자열로 기기 유형을 분류한다.
     * 저장값은 DeviceType enum의 name()이며, 조회 시 한국어 라벨로 변환된다.
     */
    private String resolveDeviceType(String userAgent) {
        if (userAgent == null) return DeviceType.UNKNOWN.name();
        String ua = userAgent.toLowerCase();
        return (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone"))
                ? DeviceType.MOBILE.name()
                : DeviceType.DESKTOP.name();
    }
}
