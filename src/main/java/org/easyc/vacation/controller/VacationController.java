package org.easyc.vacation.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.easyc.common.dto.PageRequestDto;
import org.easyc.common.dto.PageResponseDto;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.excel.dto.ExcelRequestDto;
import org.easyc.util.ExcelUtil;
import org.easyc.vacation.dto.*;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationApplication;
import org.easyc.vacation.entity.VacationHistory;
import org.easyc.vacation.service.VacationService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vacation")
public class VacationController {

    private final VacationService vacationService;

    @GetMapping("/data")
    public VacationResponseDto getVacationData(@RequestParam("target") String encodeId) {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(encodeId);
        String idStr = new String(decodedBytes);
        Long memberId = Long.parseLong(idStr);

        return vacationService.getVacation(memberId);
    }

    @PostMapping("/search")
    public PageResponseDto<Vacation>  getVacationCompanySearch(@RequestBody PageRequestDto<VacationCompanySearchRequestDto> request) {
        Pageable pageable = PageRequest.of(request.getNumber(), request.getSize());
        return vacationService.getVacationCompanySearch(request.getRequest(), pageable);
    }

    @PostMapping("/excel")
    public void excelVacationCompany(HttpServletResponse response, @RequestBody ExcelRequestDto<VacationCompanySearchRequestDto> request) throws Exception {
        Pageable pageable = PageRequest.of(0, 1000);
        List<Vacation> searchList = vacationService.excelVacationCompany(request.getRequest(), pageable);

        List<ExcelVacationDto> list = new ArrayList<>();

        for (Vacation vacation : searchList) {
            list.add(new ExcelVacationDto(vacation));
        }

        ExcelUtil.excelDownload(
                response,
                request.getFileName(),
                "vacation",
                ExcelVacationDto.class,
                list
        );
    }

    @PostMapping("/history")
    public PageResponseDto<VacationHistory> searchVacationHistoryData(@RequestBody PageRequestDto<VacationHistorySearchRequestDto> request) {
        Pageable pageable = PageRequest.of(request.getNumber(), request.getSize());
        return vacationService.searchVacationHistoryData(request.getRequest(), pageable);
    }



}
