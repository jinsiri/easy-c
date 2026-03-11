package org.easyc.attendance.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.easyc.common.audit.activity.AuditAction;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.attendance.service.AttendanceApplicationService;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.excel.dto.ExcelRequestDto;
import org.easyc.util.ExcelUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Base64;
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

    @PostMapping("/user")
    public List<AttendanceApplication> getUserAttendanceApplication(@RequestBody AttendanceRequestDto request) {
        return attendanceApplicationService.getUserAttendanceApplication(request);
    }

    @AuditAction(code = "ATTENDANCE_APP_SAVE", name = "근태 수정 요청 저장", targetType = "ATTENDANCE_APP")
    @PostMapping("/save")
    public void saveAttendanceApplication(@RequestBody AttendanceApplicationDto request) {
        attendanceApplicationService.saveAttendanceApplication(request);
    }

    @AuditAction(code = "ATTENDANCE_APP_SEARCH", name = "근태 수정 요청 검색", targetType = "ATTENDANCE_APP")
    @PostMapping("/search")
    public List<AttendanceApplication> searchAttendanceApplication(@RequestBody SearchRequestDto request) {
        return attendanceApplicationService.searchAttendanceApplication(request);
    }

    @AuditAction(code = "ATTENDANCE_APP_APPROVE", name = "근태 수정 요청 승인", targetType = "ATTENDANCE_APP")
    @PostMapping("/approve")
    public void approveAttendanceApplicationData(@RequestBody List<AttendanceApplication> request) {
        attendanceApplicationService.approveAttendanceApplicationData(request);
    }

    @AuditAction(code = "ATTENDANCE_APP_REJECT", name = "근태 수정 요청 반려", targetType = "ATTENDANCE_APP")
    @PostMapping("/reject")
    public void rejectVacationApplicationData(@RequestBody List<AttendanceApplication> request) {
        attendanceApplicationService.rejectAttendanceApplicationData(request);
    }

    @AuditAction(code = "ATTENDANCE_APP_EXCELDOWN", name = "근태 수정 요청 엑셀 다운로드", targetType = "ATTENDANCE_APP")
    @PostMapping("/excel")
    public void excelAttendanceApplication(HttpServletResponse response, @RequestBody ExcelRequestDto request) throws Exception {
        List<AttendanceApplication> searchList = attendanceApplicationService.searchAttendanceApplication(request.getSearch());
        List<ExcelAttendanceApplicationDto> list = new ArrayList<>();

        for (AttendanceApplication attendanceApplication : searchList) {
            list.add(new ExcelAttendanceApplicationDto(attendanceApplication));
        }

        ExcelUtil.excelDownload(
                response,
                request.getFileName(),
                "attendance_application",
                ExcelAttendanceApplicationDto.class,
                list
        );
    }

}
