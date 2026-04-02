package org.easyc.attendance.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.easyc.audit.activity.annotation.AuditAction;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.attendance.service.AttendanceApplicationService;
import org.easyc.common.dto.PageRequestDto;
import org.easyc.common.dto.PageResponseDto;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.excel.dto.ExcelRequestDto;
import org.easyc.util.ExcelUtil;
import org.easyc.vacation.dto.ExcelVacationApplicationDto;
import org.easyc.vacation.entity.VacationApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    @PostMapping("/user/month")
    public List<AttendanceApplication> getAttendanceApplicationUserMonth(@RequestBody AttendanceRequestDto request) {
        return attendanceApplicationService.getUserMonthAttendanceApplication(request);
    }

    @AuditAction(code = "ATTENDANCE_APP_SAVE", name = "근태 수정 요청 저장", targetType = "ATTENDANCE_APP")
    @PostMapping("/save")
    public void saveAttendanceApplication(@RequestBody AttendanceApplicationDto request) {
        attendanceApplicationService.saveAttendanceApplication(request);
    }

    @AuditAction(code = "ATTENDANCE_APP_DELETE", name = "근태 수정 요청 취소", targetType = "ATTENDANCE_APP")
    @DeleteMapping("/delete")
    public void deleteUserAttendanceApplication(@RequestParam Long id) {
        attendanceApplicationService.deleteUserAttendanceApplication(id);
    }


    @AuditAction(code = "ATTENDANCE_APP_SEARCH", name = "근태 수정 요청 검색", targetType = "ATTENDANCE_APP")
    @PostMapping("/search")
    public PageResponseDto<AttendanceApplication> searchAttendanceApplication(@RequestBody PageRequestDto<AttendanceAppSearchRequestDto> request) {
        Pageable pageable = PageRequest.of(request.getNumber(), request.getSize());
        return attendanceApplicationService.searchAttendanceApplication(request.getRequest(), pageable);
    }

    @AuditAction(code = "ATTENDANCE_APP_EXCELDOWN", name = "근태 수정 요청 엑셀 다운로드", targetType = "ATTENDANCE_APP")
    @PostMapping("/excel")
    public void excelAttendanceApplication(HttpServletResponse response, @RequestBody ExcelRequestDto<AttendanceAppSearchRequestDto> request) throws Exception {
        Pageable pageable = PageRequest.of(0, 1000);
        List<AttendanceApplication> searchList = attendanceApplicationService.excelAttendanceApplication(request.getRequest(), pageable);

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
}
