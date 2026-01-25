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
    public ResponseEntity<AttendanceResponseDto> getAttendanceTodayData(@RequestBody AttendanceRequestDto request) {
        AttendanceResponseDto reault = attendanceService.getAttendanceTodayData(request);
        return ResponseEntity.ok(reault);
    }

   @PostMapping("/calendar")
    public ResponseEntity<List<Map<String, AttendanceCalendarResponseDto>>> getAttendanceCalendarData(@RequestBody AttendanceRequestDto request) {
       List<Map<String, AttendanceCalendarResponseDto>> reault = attendanceService.getAttendanceCalendarData(request);
        return ResponseEntity.ok(reault);
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startAttendanceData(HttpServletRequest httpRequest, @RequestBody AttendanceSaveRequestDto request) {
       String ipAddress = getClientIp(httpRequest);

        Map<String, Object> reault = attendanceService.startAttendanceData(request, ipAddress);
        return ResponseEntity.ok(reault);
    }

    @PostMapping("/finish")
    public ResponseEntity<Map<String, Object>> finishAttendanceCalendar(HttpServletRequest httpRequest, @RequestBody AttendanceSaveRequestDto request) {
        String ipAddress = getClientIp(httpRequest);

        Map<String, Object> reault = attendanceService.finishAttendanceCalendar(request, ipAddress);
        return ResponseEntity.ok(reault);
    }

}
