package org.easyc.attendance.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.service.AttendanceCompanyService;
import org.easyc.attendance.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static org.easyc.common.util.utilFunc.getClientIp;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance/company")
public class AttendanceCompanyController {

    @Autowired
    private AttendanceCompanyService attendanceCompanyService;

    @PostMapping("/oneday")
    public List<Attendance> getAttendanceCompanyOnedayData(@RequestBody AttendanceCompanyRequestDto request) {
        List<Attendance> result = attendanceCompanyService.getAttendanceCompanyOnedayData(request);
        return result;
    }
}
