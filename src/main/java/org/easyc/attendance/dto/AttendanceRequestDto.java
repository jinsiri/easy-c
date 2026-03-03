package org.easyc.attendance.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceRequestDto {
    private Long memberId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime workDate;
}
