package org.easyc.jobRole.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.audit.activity.annotation.AuditAction;
import org.easyc.common.dto.BulkDeleteRequestDto;
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

    @GetMapping("/{id}")
    public JobRoleResponseDto findById(@PathVariable Long id) {
        return jobRoleService.findById(id);
    }

    @AuditAction(code = "JOB_ROLE_CREATE", name = "직무 등록", targetType = "JOB_ROLE")
    @PostMapping
    public void saveJobRole(@RequestBody JobRoleRequestDto dto) {
        jobRoleService.save(dto);
    }

    @AuditAction(code = "JOB_ROLE_UPDATE", name = "직무 수정", targetType = "JOB_ROLE")
    @PutMapping("/{id}")
    public void updateJobRole(@PathVariable Long id, @RequestBody JobRoleRequestDto dto) {
        jobRoleService.update(id, dto);
    }

    @AuditAction(code = "JOB_ROLE_DELETE", name = "직무 삭제", targetType = "JOB_ROLE")
    @DeleteMapping
    public void deleteJobRoles(@RequestBody BulkDeleteRequestDto requestDto) {
        jobRoleService.delete(requestDto.getIds());
    }

    @AuditAction(code = "JOB_ROLE_UPDATE_ORDERS", name = "직무 레벨 수정", targetType = "JOB_ROLE")
    @PostMapping("/update-orders")
    public void updateRoleOrders(@RequestBody List<JobRoleRequestDto> dtos) {
        jobRoleService.updateOrders(dtos);
    }
}
