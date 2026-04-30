package org.easyc.schedule.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.dto.AttendanceDayResponseDto;
import org.easyc.attendance.entity.Attendance;
import org.easyc.schedule.entity.Schedule;
import org.easyc.vacation.constant.VacationType;

import java.time.LocalTime;

@Getter
@SuperBuilder
@NoArgsConstructor
public class CalendarEventDto {
    private String eventType; // SCHEDULE / VACATION / OUTSIDE / ATTENDANCE

    private Long memberId;
    private String memberNm;
    private String deptNm;
    private String jobGrade;

    private boolean published = false;

    //SCHEDULE
    private String scheduleName;
    private String scheduleDesc;
    private LocalTime startTime;
    private LocalTime endTime;

    //VACATION
    private boolean vacationed = false;
    private VacationType vacationType;

    //OUTSIDE
    private boolean remoted = false;
    private WorkStatus workStatus;

    //ATTENDANCE
    private AttendanceDayResponseDto detailData = new AttendanceDayResponseDto();


    public CalendarEventDto(Attendance attendance) {
        this.eventType = attendance.isVacationed() ? "VACATION" : attendance.isRemoted() ? "OUTSIDE" : "ATTENDANCE";

        this.memberId = attendance.getMemberId();
        this.memberNm = attendance.getMemberNm();
        this.deptNm = attendance.getDeptNm();
        this.jobGrade = attendance.getJobGrade();

        this.published = true;

        //VACATION
        this.vacationed = attendance.isVacationed();
        this.vacationType = attendance.getVacationType();

        //OUTSIDE
        this.remoted = attendance.isRemoted();
        this.workStatus = attendance.getWorkStatus();

        this.detailData = new AttendanceDayResponseDto(attendance);
    }

    public CalendarEventDto(Schedule schedule, String memberNm, String deptNm, String jobGrade) {
        this.eventType = "SCHEDULE";

        this.memberId = schedule.getMemberId();
        this.memberNm = memberNm;
        this.deptNm = deptNm;
        this.jobGrade = jobGrade;

        this.published = schedule.isPublished();

        this.scheduleName = schedule.getScheduleName();
        this.scheduleDesc = schedule.getScheduleDesc();
        this.startTime = schedule.getScheduleStartTime();
        this.endTime = schedule.getScheduleEndTime();
    }
}
