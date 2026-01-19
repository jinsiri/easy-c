package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.Attendance;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceCalendarResponseDto {
    private Integer year;
    private Integer month;
    private Integer day;
    private Boolean isCurrentMonth;
    private AttendanceDayResponseDto detailData = new AttendanceDayResponseDto();

    public AttendanceCalendarResponseDto(Attendance entity) {
        this.detailData = new AttendanceDayResponseDto(entity);
    }
}






