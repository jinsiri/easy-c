package org.easyc.attendance.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.attendance.service.AttendanceCompanyService;
import org.easyc.attendance.service.AttendanceService;
import org.easyc.audit.activity.annotation.AuditAction;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.excel.dto.ExcelRequestDto;
import org.easyc.util.ExcelUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
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
    public AttendanceCompanyResponseDto getAttendanceCompanyOnedayData(@RequestBody SearchRequestDto request) {
        return attendanceCompanyService.getAttendanceCompanyOnedayData(request);
    }

    @AuditAction(code = "ATTENDANCE_COMPANY_SEARCH", name = "전사 근태 검색", targetType = "ATTENDANCE_COMPANY")
    @PostMapping("/search")
    public List<AttendanceDayResponseDto>  getAttendanceCompanySearch(@RequestBody SearchRequestDto request) {
        return attendanceCompanyService.getAttendanceCompanySearch(request);
    }

    @AuditAction(code = "ATTENDANCE_COMPANY_EXCELDOWN", name = "전사 근태 엑셀 다운로드", targetType = "ATTENDANCE_COMPANY")
    @PostMapping("/excel")
    public void excelAttendanceCompany(HttpServletResponse response, @RequestBody ExcelRequestDto request) throws Exception {
        List<AttendanceDayResponseDto> searchList = attendanceCompanyService.getAttendanceCompanySearch(request.getSearch());
        List<ExcelAttendanceDto> list = new ArrayList<>();

        for (AttendanceDayResponseDto attendanceDay : searchList) {
            list.add(new ExcelAttendanceDto(attendanceDay));
        }

        ExcelUtil.excelDownload(
                response,
                request.getFileName(),
                "attendance",
                ExcelAttendanceDto.class,
                list
        );
    }
}
