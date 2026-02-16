package org.easyc.attendance.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendanceCalendarResponseDto;
import org.easyc.attendance.dto.AttendanceRequestDto;
import org.easyc.attendance.dto.AttendanceResponseDto;
import org.easyc.attendance.dto.AttendanceSaveRequestDto;
import org.easyc.attendance.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static org.easyc.common.util.utilFunc.getClientIp;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/today")
    public AttendanceResponseDto getAttendanceTodayData(@RequestBody AttendanceRequestDto request) {
        AttendanceResponseDto result = attendanceService.getAttendanceTodayData(request);
        return result;
    }

   @PostMapping("/calendar")
    public List<Map<String, AttendanceCalendarResponseDto>>getAttendanceCalendarData(@RequestBody AttendanceRequestDto request) {
       List<Map<String, AttendanceCalendarResponseDto>> result = attendanceService.getAttendanceCalendarData(request);
        return result;
    }

    @PostMapping("/start")
    public void startAttendanceData( @RequestBody AttendanceSaveRequestDto request) {
       attendanceService.startAttendanceData(request);
    }

    @PostMapping("/finish")
    public void finishAttendanceData(@RequestBody AttendanceSaveRequestDto request) {
        attendanceService.finishAttendanceData(request);
    }

}
