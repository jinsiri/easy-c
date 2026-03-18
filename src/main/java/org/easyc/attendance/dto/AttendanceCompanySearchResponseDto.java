package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.common.dto.PageResponseDto;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceCompanySearchResponseDto {
    private Integer allCount;
    private Integer lateCount;
    private Integer earlyLeaveCount;
    private Integer absentCount;
    private Integer changeRequestCount;
    private PageResponseDto<AttendanceDayResponseDto> dayData;

}



