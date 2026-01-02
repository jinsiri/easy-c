package org.easyc.common.exception;

public class CustomException extends RuntimeException {
    private final CustomExceptionCode customExceptionCode;

    public CustomException(CustomExceptionCode customExceptionCode) {
        super(customExceptionCode.getErrorMessage());
        this.customExceptionCode = customExceptionCode;
    }

    public CustomException(CustomExceptionCode customExceptionCode, Throwable cause) {
        super(customExceptionCode.getErrorMessage(), cause);
        this.customExceptionCode = customExceptionCode;
    }

    public CustomExceptionCode getCustomExceptionCode() {
        return customExceptionCode;
    }

    // 기본 예외 생성
    public static CustomException defaultException() {
        return new CustomException(CustomExceptionCode.getDefault());
    }

    // 원인과 함께 기본 예외 생성
    public static CustomException defaultException(Throwable cause) {
        return new CustomException(CustomExceptionCode.getDefault(), cause);
    }
}
