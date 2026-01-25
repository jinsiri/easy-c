package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.Attendance;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceResponseDto {
    // 금일 데이터
    private AttendanceDayResponseDto dayData = new AttendanceDayResponseDto();

    //일주일 데이터
    private Integer totalWorkDay;
    private Long totalWorkTime;
    private Integer workDay;
    private Long workTime;
    private Long vacationTime;


    public AttendanceResponseDto(Attendance entity) {
        this.dayData = new AttendanceDayResponseDto(entity);
    }
}






