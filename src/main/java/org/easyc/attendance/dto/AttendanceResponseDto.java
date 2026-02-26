package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.constant.AttendanceType;
import org.easyc.attendance.constant.SettlementPeriod;
import org.easyc.attendance.constant.WorktimeRule;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceResponseDto {
    // 금일 데이터
    private AttendanceDayResponseDto dayData = new AttendanceDayResponseDto();

    //일주일 데이터
    private AttendanceType attendanceType; //정책 타입
    private SettlementPeriod settlementPeriod;
    private WorktimeRule worktimeRule;
    private LocalTime startTime;
    private LocalTime endTime;

    private Integer maxPolicyWorkTime;  //주 52시간 기준 최대 시간
    private Long policyWorkDay;      //정책상 근무일
    private Long policyWorkTime;        //정책상 근무시간
    private Long effectiveWorkDay;   //실제 총 근무일 - 휴가,반차 제외
    private Long effectiveWorkTime;     //실제 총 근무시간 - 휴가,반차 제외
    private Integer workDay;            //현재까지 근무일
    private Long workTime;              //현재까지 근무시간
    private Long vacationTime;          //현재까지 휴가시간

    public AttendanceResponseDto(Attendance entity) {
        this.dayData = new AttendanceDayResponseDto(entity);
    }

    public void applyWeekData(AttendanceResponseDto weekData) {
        this.attendanceType = weekData.getAttendanceType();
        this.settlementPeriod = weekData.getSettlementPeriod();
        this.worktimeRule = weekData.getWorktimeRule();
        this.startTime = weekData.getStartTime();
        this.endTime = weekData.getEndTime();

        this.maxPolicyWorkTime = weekData.getMaxPolicyWorkTime();
        this.policyWorkDay = weekData.getPolicyWorkDay();
        this.policyWorkTime = weekData.getPolicyWorkTime();
        this.effectiveWorkDay = weekData.getEffectiveWorkDay();
        this.effectiveWorkTime = weekData.getEffectiveWorkTime();
        this.workDay = weekData.getWorkDay();
        this.workTime = weekData.getWorkTime();
        this.vacationTime = weekData.getVacationTime();
    }
}






