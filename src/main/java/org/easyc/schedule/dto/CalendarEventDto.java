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
    private String eventType; // SCHEDULE / VACATION
    private Long memberId;
    private String memberNm;
    private String deptNm;
    private String jobGrade;

    private String groupId;
    private LocalDate startDate;
    private LocalDate endDate;

    //VACATION
    @Builder.Default
    private VacationApplicationDto vacationData = new VacationApplicationDto();

    //SCHEDULE
    @Builder.Default
    private Schedule scheduleData = new Schedule();


    public static CalendarEventDto fromSchedule(Schedule schedule) {
        String groupId = null;

        if( schedule.getStartDate() != null &&
                schedule.getEndDate() != null &&
                (
                        !schedule.getStartDate().isEqual(schedule.getEndDate()) ||
                                schedule.getStartTime() == null && schedule.getEndTime() == null
                )
        ){
            groupId = "SCHEDULE_" + schedule.getScheduleId();
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
                .scheduleData(schedule)
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
                .vacationData(VacationApplicationDto.fromEntity(vacationApp))
                .build();
    }

}
