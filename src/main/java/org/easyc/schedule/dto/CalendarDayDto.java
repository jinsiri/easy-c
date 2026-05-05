package org.easyc.schedule.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.attendance.dto.AttendanceDayResponseDto;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendanceApplication;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@SuperBuilder
@NoArgsConstructor
public class CalendarDayDto {
    @JsonProperty("scheduleType")
    private String scheduleType; // PERSONAL / DEPT

    @JsonProperty("date")
    private LocalDate date;

    @JsonProperty("isCurrentMonth")
    private boolean isCurrentMonth;

    @JsonProperty("isHoliday")
    private boolean isHoliday;

    @JsonProperty("holidaySubject")
    private String holidaySubject;

    @Builder.Default
    @JsonProperty("attendances")
    List<AttendanceDayResponseDto> attendances = new ArrayList<>();

    @Builder.Default
    @JsonProperty("events")
    private List<CalendarEventDto> events = new ArrayList<>();

    @Builder.Default
    @JsonProperty("applications")
    private List<AttendanceApplication> applications = new ArrayList<>();


    public void addAttendanceEvents(List<AttendanceDayResponseDto> attendance) {
        this.attendances.addAll(attendance);
    }

    public void addEvents(List<CalendarEventDto> events) {
        this.events.addAll(events);
    }

    public void addApplications(List<AttendanceApplication> apps) {
        this.applications.addAll(apps);
    }


}


