package org.easyc.attendance.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceRequestDto {
    private Long memberId;

    private String loginId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate workDate;
}
