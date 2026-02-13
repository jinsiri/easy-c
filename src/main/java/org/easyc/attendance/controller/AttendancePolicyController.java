package org.easyc.attendance.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendancePolicyDto;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.service.AttendancePolicyService;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance/policy")
public class AttendancePolicyController {

    private final AttendancePolicyService attendancePolicyService;

    @GetMapping("/all")
    public List<AttendancePolicyDto> getAllPolicy() {
        return attendancePolicyService.getAllPolicy();
    }

    @PostMapping("/save")
    public void savePolicyData(@RequestBody AttendancePolicyDto request) {
        attendancePolicyService.savePolicyData(request);
    }

    @DeleteMapping("/delete")
    public void deletePolicyData(@RequestParam("target") String encodedId) {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(encodedId);
        String idStr = new String(decodedBytes);
        Long id = Long.parseLong(idStr);

        attendancePolicyService.deletePolicyData(id);
    }
}
