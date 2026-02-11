package org.easyc.common.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@Getter
@RequiredArgsConstructor
public enum CustomExceptionCode {

    /**
     * ================================
     * 에러 코드 작성 규칙
     * ================================
     * 형식: [DOMAIN]_[설명]
     *
     * - DOMAIN: 에러가 발생한 영역
     *     - AUTH: 인증/인가 관련
     *     - MEMBER: 사용자 관련
     *     - SYSTEM: 시스템/서버 관련
     *
     * - 설명: 에러 상황을 명확히 표현 (대문자 + 언더스코어)
     *     - 예: LOGIN_FAILED, NOT_FOUND, INVALID_INPUT
     *
     * - HttpStatus는 적절한 HTTP 상태 코드 사용
     *     - 400: 잘못된 요청 (클라이언트 입력 오류)
     *     - 401: 인증 실패 (로그인 필요, 토큰 만료)
     *     - 403: 권한 없음 (인증은 됐지만 접근 불가)
     *     - 404: 리소스 없음
     *     - 500: 서버 오류
     *
     * - errorCode는 enum 이름 그대로 반환 (getErrorCode() → this.name())
     * - errorMessage는 사용자에게 보여줄 메시지
     */

    // ========== Auth (인증/인가) ==========
    AUTH_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증이 필요합니다."),
    AUTH_INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "인증 정보가 유효하지 않습니다."),
    AUTH_LOGIN_FAILED(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 일치하지 않습니다."),
    AUTH_ACCESS_DENIED(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    AUTH_DECRYPT_FAILED(HttpStatus.BAD_REQUEST, "비밀번호 복호화에 실패했습니다."),

    // ========== Member (회원) ==========
    MEMBER_INVALID_INPUT(HttpStatus.BAD_REQUEST, "유효하지 않은 사용자 입력입니다."),
    MEMBER_MISSING_INFO(HttpStatus.BAD_REQUEST, "필수 사용자 정보가 누락되었습니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),

    // 인사 기초 정보(직위/직급/직책) 중복
    MEMBER_JOB_DUPLICATE_NM(HttpStatus.BAD_REQUEST, "이미 존재하는 명칭입니다."),
    MEMBER_JOB_DUPLICATE_CODE(HttpStatus.BAD_REQUEST, "이미 존재하는 코드입니다."),
    MEMBER_JOB_NOT_FOUND(HttpStatus.NOT_FOUND, "관련 정보를 찾을 수 없습니다."),

    // ========== System (시스템) ==========
    SYSTEM_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다."),
    SYSTEM_DB_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "데이터베이스 연결에 실패했습니다."),
    ;

    private final HttpStatus httpStatus;
    private final String errorMessage;

    public String getErrorCode() {
        return this.name();  // enum 이름 그대로 반환
    }

    public static CustomExceptionCode getDefault() {
        return SYSTEM_ERROR;
    }
}
