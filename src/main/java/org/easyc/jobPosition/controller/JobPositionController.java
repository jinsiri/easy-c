package org.easyc.jobPosition.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.common.audit.activity.AuditAction;
import org.easyc.common.dto.BulkDeleteRequestDto;
import org.easyc.jobPosition.dto.JobPositionRequestDto;
import org.easyc.jobPosition.dto.JobPositionResponseDto;
import org.easyc.jobPosition.service.JobPositionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/job-positions")
public class JobPositionController {
    private final JobPositionService jobPositionService;

    @GetMapping
    public List<JobPositionResponseDto> findAll() {
        return jobPositionService.findAll();
    }

    @GetMapping("/{id}")
    public JobPositionResponseDto findById(@PathVariable Long id) {
        return jobPositionService.findById(id);
    }

    @AuditAction(code = "JOB_POSITION_CREATE", name = "직위 등록", targetType = "JOB_POSITION")
    @PostMapping
    public void saveJobPosition(@RequestBody JobPositionRequestDto dto) {
        jobPositionService.save(dto);
    }

    @AuditAction(code = "JOB_POSITION_BULK_CREATE", name = "직위 일괄 등록", targetType = "JOB_POSITION")
    @PostMapping("/from-template")
    public void saveJobPositions(@RequestBody List<JobPositionRequestDto> dtos) {
        jobPositionService.saveList(dtos);
    }

    @AuditAction(code = "JOB_POSITION_UPDATE", name = "직위 수정", targetType = "JOB_POSITION")
    @PutMapping("/{id}")
    public void updateJobPosition(@PathVariable Long id, @RequestBody JobPositionRequestDto dto) {
        jobPositionService.update(id, dto);
    }

    @AuditAction(code = "JOB_POSITION_DELETE", name = "직위 삭제", targetType = "JOB_POSITION")
    @DeleteMapping
    public void deleteJobPositions(@RequestBody BulkDeleteRequestDto requestDto) {
        jobPositionService.delete(requestDto.getIds());
    }

    @AuditAction(code = "JOB_POSITION_UPDATE_LEVELS", name = "직위 레벨 수정", targetType = "JOB_POSITION")
    @PostMapping("/update-levels")
    public void updateGradeLevels(@RequestBody List<JobPositionRequestDto> dtos) {
        jobPositionService.updateLevels(dtos);
    }
}
