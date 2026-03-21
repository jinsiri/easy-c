package org.easyc.audit.security.constant;

public enum SecurityEventType {
    LOGIN_SUCCESS,   // 로그인 성공
    LOGIN_FAILURE,   // 로그인 실패 (비밀번호 오류, 계정 없음 등)
    LOGOUT_SUCCESS,  // 로그아웃
    ACCESS_DENIED    // 인가 거부 (권한 없는 접근)
}
