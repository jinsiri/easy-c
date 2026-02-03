package org.easyc.attendance.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.AttendanceChangeRequest;
import org.easyc.attendance.service.AttendanceChangeRequestService;
import org.easyc.attendance.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static org.easyc.common.util.utilFunc.getClientIp;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance/change-request")
public class AttendanceChangeRequestController {

    @Autowired
    private AttendanceChangeRequestService attendanceChangeRequestService;

    @GetMapping("/all")
    public List<AttendanceChangeRequest> getAllAttendanceChangeRequest() {
        return attendanceChangeRequestService.getAllAttendanceChangeRequest();
    }

    @PostMapping("/save")
    public void saveWorkModifyRequest(@RequestBody AttendanceChangeDataDto request) {
        attendanceChangeRequestService.saveAttendanceChangeRequest(request);
    }


}
