package org.easyc.jobRole.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.jobRole.dto.JobRoleRequestDto;
import org.easyc.jobRole.dto.JobRoleResponseDto;
import org.easyc.jobRole.service.JobRoleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/job-roles")
public class JobRoleCotroller {
    private final JobRoleService jobRoleService;

    @GetMapping
    public List<JobRoleResponseDto> findAll() {
        return jobRoleService.findAll();
    }

    public void save(@RequestBody JobRoleRequestDto dto) {
        jobRoleService.save(dto);
    }
}
