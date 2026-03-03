package org.easyc.vacation.controller;

import lombok.RequiredArgsConstructor;
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

    @PostMapping("/save")
    public void saveVacationApplicationData(VacationApplicationDto request) {
        vacationApplicationService.saveVacationApplication(request);
    }

    @GetMapping("/data")
    public List<VacationApplication> findVacationApplicationData() {
        return vacationApplicationService.findVacationApplicationData();
    }

    @GetMapping("/user")
    public VacationApplicationResponseDto findUserVacationApplicationData(@RequestParam("target") String encodeId) {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(encodeId);
        String idStr = new String(decodedBytes);
        Long memberId = Long.parseLong(idStr);

        return vacationApplicationService.findUserVacationApplicationData(memberId);
    }

}
