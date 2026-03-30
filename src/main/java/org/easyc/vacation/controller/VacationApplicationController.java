package org.easyc.vacation.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.easyc.audit.activity.annotation.AuditAction;
import org.easyc.common.dto.PageRequestDto;
import org.easyc.common.dto.PageResponseDto;
import org.easyc.excel.dto.ExcelRequestDto;
import org.easyc.util.ExcelUtil;
import org.easyc.vacation.dto.*;
import org.easyc.vacation.entity.VacationApplication;
import org.easyc.vacation.service.VacationApplicationService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vacation/application")
public class VacationApplicationController {

    private final VacationApplicationService vacationApplicationService;

    @GetMapping("/user")
    public List<VacationApplication> findUserVacationApplicationData(@RequestParam("target") String encodeId) {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(encodeId);
        String idStr = new String(decodedBytes);
        Long memberId = Long.parseLong(idStr);

        return vacationApplicationService.findUserVacationApplicationData(memberId);
    }

    @AuditAction(code = "VACATION_APP_SAVE", name = "휴가 신청", targetType = "VACATION_APP")
    @PostMapping("/save")
    public void saveVacationApplicationData(@RequestBody VacationApplicationDto request) {
        vacationApplicationService.saveVacationApplication(request);
    }

    @AuditAction(code = "VACATION_APP_SEARCH", name = "휴가 신청 내역 검색", targetType = "VACATION_APP")
    @PostMapping("/search")
    public PageResponseDto<VacationApplication> searchVacationApplicationData(@RequestBody PageRequestDto<VacationAppSearchRequestDto> request) {
        Pageable pageable = PageRequest.of(request.getNumber(), request.getSize());
        return vacationApplicationService.searchVacationApplicationData(request.getRequest(), pageable);
    }

    @AuditAction(code = "VACATION_APP_EXCELDOWN", name = "휴가 신청 엑셀 다운로드", targetType = "VACATION_APP")
    @PostMapping("/excel")
    public void excelVacationApplication(HttpServletResponse response, @RequestBody ExcelRequestDto<VacationAppSearchRequestDto> request) throws Exception {
        Pageable pageable = PageRequest.of(0, 1000);
        List<VacationApplication> searchList = vacationApplicationService.excelVacationApplication(request.getRequest(), pageable);

        List<ExcelVacationApplicationDto> list = new ArrayList<>();

        for (VacationApplication vacationApplication : searchList) {
            list.add(new ExcelVacationApplicationDto(vacationApplication));
        }

        ExcelUtil.excelDownload(
                response,
                request.getFileName(),
                "vacation_application",
                ExcelVacationApplicationDto.class,
                list
        );
    }

    @AuditAction(code = "VACATION_APP_APPROVE", name = "휴가 신청 승인", targetType = "VACATION_APP")
    @PostMapping("/approve")
    public void approveVacationApplicationData(@RequestBody List<VacationApplication> request) {
        vacationApplicationService.approveVacationApplicationData(request);
    }

    @AuditAction(code = "VACATION_APP_REJECT", name = "휴가 신청 반려", targetType = "VACATION_APP")
    @PostMapping("/reject")
    public void rejectVacationApplicationData(@RequestBody  List<VacationApplication> request) {
        vacationApplicationService.rejectVacationApplicationData(request);
    }

    @PostMapping("/user/search")
    public PageResponseDto<VacationApplication> searchUserVacationApplicationData( @RequestBody PageRequestDto<VacationAppSearchRequestDto> request) {
        Pageable pageable = PageRequest.of(request.getNumber(), request.getSize());
        return vacationApplicationService.searchUserVacationApplicationData(request.getRequest(), pageable);
    }

}
