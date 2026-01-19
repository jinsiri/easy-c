package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.Attendance;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceResDto {
    // 금일 데이터
    private AttendanceDayResDto dayData = new AttendanceDayResDto();

    //일주일 데이터
    private Integer totalWorkDay;
    private Long totalWorkTime;
    private Integer workDay;
    private Long workTime;
    private Long vacationTime;


    public AttendanceResDto(Attendance entity) {
        this.dayData = new AttendanceDayResDto(entity);
    }
}






