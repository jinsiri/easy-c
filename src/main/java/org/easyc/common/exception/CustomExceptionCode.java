package org.easyc.common.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.http.HttpStatus;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum CustomExceptionCode {
    /**
     * ================================
     * 에러 코드 작성 규칙
     * ================================
     * [DOMAIN]_[HTTP 상태코드]_[3자리 순번]
     *
     * - DOMAIN: 에러가 발생한 영역 (예: USER, AUTH, SYSTEM 등)
     * - HTTP 상태코드: 표준 HTTP Status Code 사용 (400, 401, 403, 404, 500 등)
     * - 3자리 순번: 같은 상태코드 내에서 중복되지 않도록 관리
     *     - 예: USER_400_001, SYSTEM_400_002, ...
     *
     * - 에러 도메인, 상태 코드별로 명확히 구분.
     * - 추후 확장성 고려해 순번은 반드시 **3자리**로 유지 (ex. 001, 002, ..., 010, 100)
     */

    // User 관련 에러
    USER_400_001(HttpStatus.BAD_REQUEST, "USER_400_001", "유효하지 않은 사용자 입력입니다."),
    USER_400_002(HttpStatus.BAD_REQUEST, "USER_400_002", "필수 사용자 정보가 누락되었습니다."),
    USER_404_001(HttpStatus.NOT_FOUND, "USER_404_001", "사용자를 찾을 수 없습니다."),

    // Auth 관련 에러
    AUTH_401_001(HttpStatus.UNAUTHORIZED, "AUTH_401_001", "인증이 필요합니다."),
    AUTH_401_002(HttpStatus.UNAUTHORIZED, "AUTH_401_002", "인증 정보가 유효하지 않습니다."),
    AUTH_403_001(HttpStatus.FORBIDDEN, "AUTH_403_001", "접근 권한이 없습니다."),

    // System 관련 에러
    SYSTEM_500_001(HttpStatus.INTERNAL_SERVER_ERROR, "SYSTEM_500_001", "서버 오류가 발생했습니다."),
    SYSTEM_500_002(HttpStatus.INTERNAL_SERVER_ERROR, "SYSTEM_500_002", "데이터베이스 연결에 실패했습니다.")
    ;

    private final HttpStatus httpStatus;
    private final String errorCode;
    private final String errorMessage;

    //todo 어노테이션 사용 안됨.
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    CustomExceptionCode(HttpStatus httpStatus, String errorCode, String errorMessage) {
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    public static CustomExceptionCode getDefault() {
        return SYSTEM_500_001; // 기본적으로 SYSTEM_500_001을 반환
    }
}
