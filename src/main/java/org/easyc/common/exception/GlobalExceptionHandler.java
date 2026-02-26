package org.easyc.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.easyc.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // CustomException을 상속받은 모든 예외 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse> handleException(CustomException exception) {
        return ResponseEntity
                .status(exception.getHttpStatus())
                .body(ApiResponse.ofFailure(exception.getCustomExceptionCode()));
    }

    // 권한 없음 (PreAuthorize에서 흔히 발생) -> 403
    // Spring Security 6 @PreAuthorize → AuthorizationDeniedException
    // Filter 단계 → AccessDeniedException
    @ExceptionHandler({AuthorizationDeniedException.class, AccessDeniedException.class})
    public ResponseEntity<ApiResponse<?>> handleAccessDenied(Exception e) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.ofFailure(CustomExceptionCode.AUTH_ACCESS_DENIED));
    }

    // 인증 안됨(로그인 안함/토큰없음 등) -> 401
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse> handleAuthentication(AuthenticationException e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.ofFailure(CustomExceptionCode.AUTH_UNAUTHORIZED));
    }

    // 로그인 실패 (아이디 없음 + 비밀번호 불일치 통합)
    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<ApiResponse> handleBadCredentials(AuthenticationException e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.ofFailure(CustomExceptionCode.AUTH_LOGIN_FAILED));
    }

    // 정적 리소스 없음 (favicon.ico, 존재하지 않는 파일 요청 등)
    // 브라우저가 자동으로 요청하는 케이스가 많아 ERROR 로그 없이 404만 반환
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Void> handleNoResourceFound(NoResourceFoundException e) {
        return ResponseEntity.notFound().build();
    }

    // 예상치 못한 모든 예외 처리 (NPE, JPA 오류 등)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGenericException(Exception exception) {
        log.error("Unhandled exception: ", exception);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.ofFailure(CustomExceptionCode.SYSTEM_ERROR));
    }

}
