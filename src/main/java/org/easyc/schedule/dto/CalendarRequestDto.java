package org.easyc.schedule.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.easyc.attendance.entity.AttendanceApplication;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@SuperBuilder
@NoArgsConstructor
public class CalendarRequestDto {
    private List<Long> memberIds;
    private String calendarType; // PERSONAL / DEPT

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
}



