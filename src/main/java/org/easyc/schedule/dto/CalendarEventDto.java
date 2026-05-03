package org.easyc.schedule.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.dto.AttendanceDayResponseDto;
import org.easyc.attendance.entity.Attendance;
import org.easyc.schedule.constant.ScheduleType;
import org.easyc.schedule.entity.Schedule;
import org.easyc.vacation.constant.VacationType;
import org.easyc.vacation.dto.VacationApplicationDto;
import org.easyc.vacation.entity.VacationApplication;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

@Getter
@SuperBuilder
@NoArgsConstructor
public class CalendarEventDto {
    private String eventType; // SCHEDULE / VACATION / OUTSIDE / ATTENDANCE
    private Long memberId;
    private String memberNm;
    private String deptNm;
    private String jobGrade;

    private String groupId;
    private LocalDate startDate;
    private LocalDate endDate;
    @Builder.Default
    private boolean published = false;

    //SCHEDULE
    private String scheduleName;
    private String scheduleDesc;
    private LocalTime startTime;
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    private ScheduleType scheduleType;

    //ATTENDANCE
    @Builder.Default
    private AttendanceDayResponseDto detailData = new AttendanceDayResponseDto();

    //VACATION
    @Builder.Default
    private VacationApplicationDto vacationData = new VacationApplicationDto();


    public static CalendarEventDto fromAttendance (Attendance attendance) {
        return CalendarEventDto.builder()
                .eventType("ATTENDANCE")
                .memberId(attendance.getMemberId())
                .memberNm(attendance.getMemberNm())
                .deptNm(attendance.getDeptNm())
                .jobGrade(attendance.getJobGrade())
                .startDate(attendance.getWorkDate())
                .endDate(attendance.getWorkDate())
                .published(true)
                .detailData(AttendanceDayResponseDto.fromEntity(attendance))
                .build();
    }

    public static CalendarEventDto fromSchedule(Schedule schedule) {
        String groupId = null;
        if(schedule.getEndDate() != null || (schedule.getStartTime() == null && schedule.getEndTime() == null)) {
            groupId = "SCHEDULE_" + schedule.getSchedule_id();
        }

        return CalendarEventDto.builder()
                .eventType("SCHEDULE")
                .groupId(groupId)
                .memberId(schedule.getMemberId())
                .memberNm(schedule.getMemberNm())
                .deptNm(schedule.getDeptNm())
                .jobGrade(schedule.getJobGrade())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .published(schedule.isPublished())
                .scheduleName(schedule.getScheduleName())
                .scheduleDesc(schedule.getScheduleDesc())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .scheduleType(schedule.getScheduleType())
                .build();
    }

    public static CalendarEventDto fromVacation(VacationApplication vacationApp) {
        return CalendarEventDto.builder()
                .eventType("VACATION")
                .groupId("VACATION_" + vacationApp.getVacationApplicationId())
                .memberId(vacationApp.getMemberId())
                .memberNm(vacationApp.getMemberNm())
                .deptNm(vacationApp.getDeptNm())
                .jobGrade(vacationApp.getJobGrade())
                .startDate(vacationApp.getStartDate())
                .endDate(vacationApp.getEndDate())
                .published(true)
                .vacationData(VacationApplicationDto.fromEntity(vacationApp))
                .build();
    }

}
