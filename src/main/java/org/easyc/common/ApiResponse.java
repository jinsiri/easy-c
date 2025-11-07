package org.easyc.common;

import jakarta.annotation.Nullable;
import org.easyc.exception.CustomExceptionCode;

import java.time.Instant;

/**
 * @param result S, F
 */
public record ApiResponse<D>(
        String status,
        String result,
        String message,
        Instant timestamp,
        @Nullable D data,
        CustomExceptionCode exception
) {
    public ApiResponse(String status, String result, String message, @Nullable D data, @Nullable CustomExceptionCode exception) {
        this(status, result, message, Instant.now(), data, exception);
    }

    public static <D> ApiResponse<D> ofSuccess(String message, D data) {
        return new ApiResponse<>("200", "S", message, data, null);
    }

    public static <D> ApiResponse<D> ofFailure(CustomExceptionCode exception) {
        return new ApiResponse<>(
                Integer.toString(exception.getHttpStatus().value()),
                "F",
                exception.getErrorMessage(),
                null,
                exception
        );
    }
}


