package org.easyc.schedule.service;

import lombok.RequiredArgsConstructor;

import org.easyc.attendance.dto.AttendanceRequestDto;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.attendance.repository.AttendanceApplicationRepository;
import org.easyc.attendance.repository.AttendanceRepository;
import org.easyc.attendance.repository.HolidayCalendarRepository;
import org.easyc.attendance.service.AttendanceService;
import org.easyc.schedule.dto.CalendarDayDto;
import org.easyc.schedule.dto.CalendarEventDto;
import org.easyc.schedule.dto.CalendarRequestDto;
import org.easyc.schedule.repository.ScheduleRepository;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final AttendanceService attendanceService;

    public List<Map<String, CalendarDayDto>> getUserMonthSchedules(CalendarRequestDto request) {
        Long memberId = Optional.ofNullable(request.getMemberIds())
                .filter(list -> !list.isEmpty())
                .map(list -> list.get(0))
                .orElseThrow(() -> new IllegalArgumentException("memberIds is required"));

        YearMonth yearMonth = YearMonth.of(request.getDate().getYear(), request.getDate().getMonthValue());
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        List<Map<String, CalendarDayDto>> calendarFrame =  attendanceService.createCalendarFrame(firstDay, lastDay, request.getScheduleType());

        Map<LocalDate, List<CalendarEventDto>> attendanceMap = attendanceService.createAttendanceToCalendarMap(memberId, firstDay, lastDay, request.getScheduleType());
        Map<LocalDate, List<AttendanceApplication>> attendanceApplicationMap = attendanceService.createAttendanceAppMap(memberId, firstDay, lastDay);

        List<Map<String, CalendarDayDto>> resultList =
            calendarFrame.stream().map(dayMap -> {

                dayMap.forEach((key, dayDto) -> {
                    LocalDate date = dayDto.getDate();

                    dayDto.addEvents(attendanceMap.getOrDefault(date, List.of()));
                    dayDto.addApplications(attendanceApplicationMap.getOrDefault(date, List.of()));
                });

                return dayMap;
            }).toList();

        return resultList;
    }
}
