package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceSaveReqDto {
    private Long memberId;
    private String startTime;
    private String endTime;
    private BigDecimal registerLatitude;
    private BigDecimal registerLongitude;

}
