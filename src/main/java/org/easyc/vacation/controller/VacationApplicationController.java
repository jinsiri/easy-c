package org.easyc.vacation.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.vacation.dto.VacationApplicationDto;
import org.easyc.vacation.dto.VacationApplicationResponseDto;
import org.easyc.vacation.entity.VacationApplication;
import org.easyc.vacation.service.VacationApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vacation/application")
public class VacationApplicationController {

    private final VacationApplicationService vacationApplicationService;

    @GetMapping("/user")
    public VacationApplicationResponseDto findUserVacationApplicationData(@RequestParam("target") String encodeId) {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(encodeId);
        String idStr = new String(decodedBytes);
        Long memberId = Long.parseLong(idStr);

        return vacationApplicationService.findUserVacationApplicationData(memberId);
    }

    @PostMapping("/save")
    public void saveVacationApplicationData(@RequestBody VacationApplicationDto request) {
        vacationApplicationService.saveVacationApplication(request);
    }

    @PostMapping("/search")
    public List<VacationApplication> searchVacationApplicationData(@RequestBody SearchRequestDto request) {
        return vacationApplicationService.searchVacationApplicationData(request);
    }

    @PostMapping("/approve")
    public void approveVacationApplicationData(@RequestBody VacationApplication request) {
        vacationApplicationService.approveVacationApplicationData(request);
    }

    @PostMapping("/reject")
    public void rejectVacationApplicationData(@RequestBody VacationApplication request) {
        vacationApplicationService.rejectVacationApplicationData(request);
    }

}
