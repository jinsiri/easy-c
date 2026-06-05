package org.easyc.attendance.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.*;
import org.easyc.audit.activity.annotation.AuditAction;
import org.easyc.attendance.service.AttendanceService;
import org.easyc.schedule.dto.CalendarDayDto;
import org.easyc.schedule.dto.CalendarRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/user")
    public AttendanceDayResponseDto getAttendanceUserData(@RequestBody AttendanceRequestDto request) {
        AttendanceDayResponseDto result = attendanceService.getAttendanceUserData(request);
        return result;
    }

    @PostMapping("/today")
    public AttendanceResponseDto getAttendanceTodayData(@RequestBody AttendanceRequestDto request) {
        AttendanceResponseDto result = attendanceService.getAttendanceTodayData(request);
        return result;
    }

   @PostMapping("/calendar")
    public List<Map<String, CalendarDayDto>>getAttendanceCalendarData(@RequestBody CalendarRequestDto request) {
       List<Map<String, CalendarDayDto>> result = attendanceService.getAttendanceCalendarData(request);
        return result;
    }

    @AuditAction(code = "ATTENDANCE_START", name = "출근 기록", targetType = "ATTENDANCE")
    @PostMapping("/start")
    public void startAttendanceData( @RequestBody AttendanceSaveRequestDto request) {
       attendanceService.startAttendanceData(request);
    }

    @AuditAction(code = "ATTENDANCE_FINISH", name = "퇴근 기록", targetType = "ATTENDANCE")
    @PostMapping("/finish")
    public void finishAttendanceData(@RequestBody AttendanceSaveRequestDto request) {
        attendanceService.finishAttendanceData(request);
    }

}
