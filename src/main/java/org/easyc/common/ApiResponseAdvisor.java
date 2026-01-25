package org.easyc.common;

import lombok.RequiredArgsConstructor;
import org.easyc.common.response.ApiResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
@RequiredArgsConstructor
public class ApiResponseAdvisor implements ResponseBodyAdvice<Object> {

    // 추후 감사, 알림 처리 추가 todo
//    private final AuditService auditService;
//    private final NotificationService notificationService;

    @Override
    public boolean supports(MethodParameter returnType,
                            Class<? extends HttpMessageConverter<?>> converterType) {

        // String 응답은 건드리지 않는다 (가장 중요)
        return !StringHttpMessageConverter.class.isAssignableFrom(converterType);
    }


    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {

        // 감사/알림 로그 처리
//        auditService.log(request, body);
//        notificationService.notify(body);

        // String 응답은 그대로 반환 (절대 래핑 금지)
        if (body instanceof String) {
            return body;
        }

        // 이미 ApiResponse면 그대로 반환
        if (body instanceof ApiResponse<?>) {
            return body;
        }

        // void / null 응답 대응
        if (body == null) {
            return ApiResponse.ofSuccess("요청이 성공적으로 처리되었습니다.", null);
        }

        // 일반 응답 → 성공 ApiResponse로 래핑
        return ApiResponse.ofSuccess("OK", body);
    }
}
