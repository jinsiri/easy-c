package org.easyc.common.exception;

import org.easyc.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // CustomException을 상속받은 모든 예외 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse> handleException(CustomException exception) {
        return ResponseEntity
                .status(exception.getHttpStatus())
                .body(ApiResponse.ofFailure(exception.getCustomExceptionCode()));
    }


    // 로그인 실패 (아이디 없음 + 비밀번호 불일치 통합)
    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<ApiResponse> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.ofFailure(CustomExceptionCode.AUTH_LOGIN_FAILED));
    }

}
