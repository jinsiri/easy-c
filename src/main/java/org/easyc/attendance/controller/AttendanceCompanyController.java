package org.easyc.attendance.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.service.AttendanceCompanyService;
import org.easyc.audit.activity.annotation.AuditAction;
import org.easyc.common.dto.PageRequestDto;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.excel.dto.ExcelRequestDto;
import org.easyc.util.ExcelUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance/company")
public class AttendanceCompanyController {

    @Autowired
    private AttendanceCompanyService attendanceCompanyService;

    @AuditAction(code = "ATTENDANCE_COMPANY_SEARCH", name = "전사 근태 검색", targetType = "ATTENDANCE_COMPANY")
    @PostMapping("/search/static")
    public AttendanceCompanySearchResponseDto getAttendanceCompanySearchStatic(@RequestBody PageRequestDto<AttendanceCompanySearchRequestDto> request) {
        Pageable pageable = PageRequest.of(request.getNumber(), request.getSize());
        return attendanceCompanyService.getAttendanceCompanySearchStatic(request.getRequest(), pageable);
    }

    @AuditAction(code = "ATTENDANCE_COMPANY_EXCELDOWN", name = "전사 근태 엑셀 다운로드", targetType = "ATTENDANCE_COMPANY")
    @PostMapping("/excel")
    public void excelAttendanceCompany(HttpServletResponse response, @RequestBody ExcelRequestDto<AttendanceCompanySearchRequestDto> request) throws Exception {
        Pageable pageable = PageRequest.of(1, 1000);

        List<AttendanceDayResponseDto> searchList =  attendanceCompanyService.getAttendanceCompanySearch(request.getRequest(), pageable);
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
