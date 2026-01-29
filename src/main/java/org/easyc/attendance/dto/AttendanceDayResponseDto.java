package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.Attendance;
import org.easyc.common.constant.WorkType;
import org.easyc.common.constant.WorkStatus;
import org.easyc.common.constant.VacationType;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceDayResponseDto {
    private Long attendanceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long fullTime;
    private Long overTime;
    private WorkType workType;
    private WorkStatus workStatus;
    private VacationType vacationType;
    private String detail;

    public AttendanceDayResponseDto(Attendance entity) {
        this.attendanceId = entity.getAttendanceId();
        this.startTime = entity.getStartTime();
        this.endTime = entity.getEndTime();
        this.fullTime = entity.getTotalWorkMinute();
        this.overTime = entity.getOvertimeMinute();
        this.workType = entity.getWorkType();
        this.workStatus = entity.getWorkStatus();
        this.vacationType = entity.getVacationType();
    }
}






