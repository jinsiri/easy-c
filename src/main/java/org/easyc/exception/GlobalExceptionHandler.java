package org.easyc.exception;

import org.easyc.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // CustomException을 상속받은 모든 예외 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse> handleException(CustomException exception) {
        return ResponseEntity
                .status(exception.getCustomExceptionCode().getHttpStatus())
                .body(ApiResponse.ofFailure(exception.getCustomExceptionCode()));
    }

}
