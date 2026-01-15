package org.easyc.attendance.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.Attendance;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceCalendarResDto {
    private Integer day;
    private Boolean isCurrentMonth;
    private AttendanceDayResDto detailData = new AttendanceDayResDto();

    public AttendanceCalendarResDto(Attendance entity) {
        this.detailData = new AttendanceDayResDto(entity);
    }
}






