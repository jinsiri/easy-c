package org.easyc.deptMemberMap.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.deptMemberMap.dto.DeptMemberMapRequestDto;
import org.easyc.deptMemberMap.service.DeptMemberMapService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dept-member-map")
public class DeptMemberMapController {
    private final DeptMemberMapService deptMemberMapService;

    @PostMapping("/assign")
    public void assignMembersToDept(@RequestBody DeptMemberMapRequestDto dto) {
        deptMemberMapService.assignMembersToDept(dto);
    }

    @PostMapping("/assign-role")
    public void assignDeptRole(@RequestBody DeptMemberMapRequestDto dto) {
        deptMemberMapService.assignDeptRole(dto);
    }
}
