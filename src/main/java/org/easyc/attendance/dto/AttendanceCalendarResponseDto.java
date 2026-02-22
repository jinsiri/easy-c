package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendanceChangeRequest;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceCalendarResponseDto {
    private Integer year;
    private Integer month;
    private Integer day;
    private Boolean isCurrentMonth;
    private Boolean isHoliday;
    private String holidaySubject;
    private LocalTime defaultStartTime;
    private LocalTime defaultEndTime;
    private AttendanceDayResponseDto detailData = new AttendanceDayResponseDto();

    public AttendanceCalendarResponseDto(Attendance entity) {
        this.detailData = new AttendanceDayResponseDto(entity);
    }

    public AttendanceCalendarResponseDto(Attendance entity, AttendanceChangeRequest requestEntity) {
        AttendanceDayResponseDto dto = new AttendanceDayResponseDto(entity);
        if( requestEntity != null ) dto.setChangeRequestId(requestEntity.getWorkRequestId());

        this.detailData = dto;
    }
}






