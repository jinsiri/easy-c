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
    private Integer policyWorkDay;      //정책상 근무일
    private Long policyWorkTime;        //정책상 근무시간
    private Integer effectiveWorkDay;   //실제 총 근무일 - 휴가,반차 제외
    private Long effectiveWorkTime;     //실제 총 근무시간 - 휴가,반차 제외
    private Integer workDay;            //현재까지 근무일
    private Long workTime;              //현재까지 근무시간
    private Long vacationTime;          //현재까지 휴가시간

    public AttendanceResponseDto(Attendance entity) {
        this.dayData = new AttendanceDayResponseDto(entity);
    }

    public void applyWeekData(AttendanceResponseDto weekData) {
        this.policyWorkDay = weekData.policyWorkDay;
        this.policyWorkTime = weekData.policyWorkTime;
        this.effectiveWorkDay = weekData.effectiveWorkDay;
        this.effectiveWorkTime = weekData.effectiveWorkTime;
        this.workDay = weekData.workDay;
        this.workTime = weekData.workTime;
        this.vacationTime = weekData.vacationTime;
    }
}






