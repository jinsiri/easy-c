package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceSaveRequestDto {
    private Long memberId;
    private String loginId;
    private String startTime;
    private String endTime;
    private BigDecimal registerLatitude;
    private BigDecimal registerLongitude;

}
