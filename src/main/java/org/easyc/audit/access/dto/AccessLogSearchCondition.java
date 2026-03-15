package org.easyc.audit.access.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class AccessLogSearchCondition {

    private String loginId;
    private String method;
    private String uri;
    private Integer status;
    private String deviceType;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fromDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate toDate;

    public LocalDateTime getFromDateTime() {
        return fromDate != null ? fromDate.atStartOfDay() : null;
    }

    public LocalDateTime getToDateTime() {
        return toDate != null ? toDate.plusDays(1).atStartOfDay() : null;
    }
}
