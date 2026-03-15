package org.easyc.audit.activity.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class ActivityLogSearchCondition {

    private String loginId;
    private String actionCode;
    private String result;  // S / F

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
