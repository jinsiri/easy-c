package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.Attendance;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceCompanyResponseDto {
    private Integer allCount;
    private Integer lateCount;
    private Integer earlyLeaveCount;
    private Integer absentCount;
    private Integer changeRequestCount;
    private List<AttendanceDayResponseDto> dayData;

}






