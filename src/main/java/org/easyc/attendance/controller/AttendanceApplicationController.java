package org.easyc.attendance.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.attendance.service.AttendanceApplicationService;
import org.easyc.common.dto.SearchRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance/application")
public class AttendanceApplicationController {

    @Autowired
    private AttendanceApplicationService attendanceApplicationService;

    @GetMapping("/all")
    public List<AttendanceApplication> getAllAttendanceApplication() {
        return attendanceApplicationService.getAllAttendanceApplication();
    }

    @PostMapping("/save")
    public void saveAttendanceApplication(@RequestBody AttendanceApplicationDto request) {
        attendanceApplicationService.saveAttendanceApplication(request);
    }

    @PostMapping("/search")
    public List<AttendanceApplication> searchAttendanceApplication(@RequestBody SearchRequestDto request) {
        return attendanceApplicationService.searchAttendanceApplication(request);
    }


}
