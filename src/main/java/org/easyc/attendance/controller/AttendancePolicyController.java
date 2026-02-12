package org.easyc.attendance.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendanceChangeDataDto;
import org.easyc.attendance.entity.AttendanceChangeRequest;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.service.AttendanceChangeRequestService;
import org.easyc.attendance.service.AttendancePolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance/policy")
public class AttendancePolicyController {

    private final AttendancePolicyService attendancePolicyService;

    @GetMapping("/all")
    public List<AttendancePolicy> getAllPolicy() {
        return attendancePolicyService.getAllPolicy();
    }
}
