package org.easyc.vacation.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendancePolicyDto;
import org.easyc.attendance.service.AttendancePolicyService;
import org.easyc.vacation.dto.VacationPolicyDto;
import org.easyc.vacation.service.VacationPolicyService;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vacation/policy")
public class VacationPolicyController {

    private final VacationPolicyService vacationPolicyService;

    @GetMapping("/all")
    public List<VacationPolicyDto> getAllPolicy() {
        return vacationPolicyService.getAllPolicy();
    }

    @PostMapping("/save")
    public void savePolicyData(@RequestBody VacationPolicyDto request) {
        vacationPolicyService.savePolicyData(request);
    }

    @DeleteMapping("/delete")
    public void deletePolicyData(@RequestParam("target") String encodedId) {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(encodedId);
        String idStr = new String(decodedBytes);
        Long id = Long.parseLong(idStr);

        vacationPolicyService.deletePolicyData(id);
    }
}
