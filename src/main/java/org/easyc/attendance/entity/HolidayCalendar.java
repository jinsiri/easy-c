package org.easyc.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HolidayCalendar {
    @Id
    @SequenceGenerator(name="holiday_calendar_seq", sequenceName="holiday_calendar_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="holiday_calendar_seq")
    private Long holidayCalendarId;

    @Column(name = "year")
    private String year;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name="subject")
    private String subject;
}
