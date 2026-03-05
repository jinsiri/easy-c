package org.easyc.common.audit.support;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class RequestAuditUtils {

    private RequestAuditUtils() {}

    public static HttpServletRequest currentRequestOrNull() {
        var attrs = RequestContextHolder.getRequestAttributes();
        if (attrs instanceof ServletRequestAttributes sra) return sra.getRequest();
        return null;
    }

    public static String resolveRequestId(HttpServletRequest req) {
        if (req == null) return null;

        // AccessLogInterceptor에서 박아둔 requestId 우선
        Object attr = req.getAttribute("requestId");
        if (attr instanceof String s && !s.isBlank()) return s;

        String header = req.getHeader("X-Request-Id");
        return (header == null || header.isBlank()) ? null : header;
    }

    public static String resolveIp(HttpServletRequest req) {
        if (req == null) return null;

        String forwarded = req.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) return forwarded.split(",")[0].trim();

        return req.getRemoteAddr();
    }

    public static String resolveUserAgent(HttpServletRequest req) {
        return (req == null) ? null : req.getHeader("User-Agent");
    }
}
