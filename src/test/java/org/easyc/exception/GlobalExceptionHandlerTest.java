package org.easyc.exception;

import org.easyc.common.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

public class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

    @Test
    void 예외핸들러_테스트() {
        // given (예외 객체 생성)
        CustomException exception = CustomException.defaultException();

        // when (핸들러 실행)
        ResponseEntity<ApiResponse> responseEntity = exceptionHandler.handleException(exception);

        // then (올바른 ResponseEntity가 반환되는지 검증)
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        ApiResponse apiResponseBody = responseEntity.getBody();
        assertThat(apiResponseBody).isNotNull();
        assertThat(apiResponseBody.status()).isEqualTo("500"); // HTTP 상태 코드
        assertThat(apiResponseBody.result()).isEqualTo("F"); // 실패 응답
        assertThat(apiResponseBody.message()).isEqualTo("서버 오류가 발생했습니다.");
        assertThat(apiResponseBody.data()).isNull();
        assertThat(apiResponseBody.exception()).isEqualTo(exception.getCustomExceptionCode());
    }
}
