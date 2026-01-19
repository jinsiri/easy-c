package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.Attendance;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceDayResDto {
    private Long attendanceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long fullTime;
    private Long overTime;
    private String workStatus;
    private String vacation;
    private String confirm;

    public AttendanceDayResDto(Attendance entity) {
        this.attendanceId = entity.getAttendanceId();
        this.startTime = entity.getStartTime();
        this.endTime = entity.getEndTime();
        this.fullTime = entity.getTotalWorkMinute();
        this.overTime = entity.getOvertimeMinute();
        this.workStatus = entity.getWorkStatus();
    }
}






