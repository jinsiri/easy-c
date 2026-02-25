package org.easyc.vacation.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.vacation.dto.VacationPolicyDto;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.service.VacationPolicyService;
import org.easyc.vacation.service.VacationService;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vacation")
public class VacationController {

    private final VacationService vacationService;

    @GetMapping("/data")
    public Vacation getVacationData(@RequestParam("target") String encodeId) {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(encodeId);
        String idStr = new String(decodedBytes);
        Long memberId = Long.parseLong(idStr);

        return vacationService.getVacationData(memberId);
    }

    @PostMapping("/search")
    public List<Vacation>  getVacationCompanySearch(@RequestBody SearchRequestDto request) {
        List<Vacation> result = vacationService.getVacationCompanySearch(request);
        return result;
    }

}
