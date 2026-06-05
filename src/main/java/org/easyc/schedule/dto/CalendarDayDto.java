package org.easyc.schedule.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.attendance.dto.AttendanceDayResponseDto;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.schedule.constant.ScheduleType;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@SuperBuilder
@NoArgsConstructor
public class CalendarDayDto {
    @Enumerated(EnumType.STRING)
    @JsonProperty("scheduleType")
    private ScheduleType scheduleType;

    @JsonProperty("date")
    private LocalDate date;

    @JsonProperty("isCurrentMonth")
    private boolean isCurrentMonth;

    @JsonProperty("isHoliday")
    private boolean isHoliday;

    @JsonProperty("holidaySubject")
    private String holidaySubject;

    @Builder.Default
    @JsonProperty("attendance")
    AttendanceDayResponseDto attendance = new AttendanceDayResponseDto();

    @Builder.Default
    @JsonProperty("events")
    private List<CalendarEventDto> events = new ArrayList<>();

    @Builder.Default
    @JsonProperty("applications")
    private List<AttendanceApplication> applications = new ArrayList<>();


    public void addAttendance(AttendanceDayResponseDto attendance) {
        this.attendance = attendance;
    }

    public void addEvents(List<CalendarEventDto> events) {
        this.events.addAll(events);
    }

    public void addApplications(List<AttendanceApplication> apps) {
        this.applications.addAll(apps);
    }


}


