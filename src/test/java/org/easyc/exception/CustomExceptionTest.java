package org.easyc.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;

public class CustomExceptionTest {

    @Test
    void 시스템오류_기본_예외_테스트() {
        CustomException exception = CustomException.defaultException();

        assertThat(exception).isInstanceOf(CustomException.class);
        assertThat(exception.getMessage()).isEqualTo("서버 오류가 발생했습니다.");
        assertThat(exception.getCustomExceptionCode().getErrorCode()).isEqualTo("SYSTEM_500_001");
        assertThat(exception.getCustomExceptionCode().getHttpStatus()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
