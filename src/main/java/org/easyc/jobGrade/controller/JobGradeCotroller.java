package org.easyc.jobGrade.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.common.dto.BulkDeleteRequestDto;
import org.easyc.jobGrade.dto.JobGradeRequestDto;
import org.easyc.jobGrade.dto.JobGradeResponseDto;
import org.easyc.jobGrade.service.JobGradeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/job-grades")
public class JobGradeCotroller {
    private final JobGradeService jobGradeService;

    @GetMapping
    public List<JobGradeResponseDto> findAll() {
        return jobGradeService.findAll();
    }

    @GetMapping("/{id}")
    public JobGradeResponseDto findById(@PathVariable Long id) {
        return jobGradeService.findById(id);
    }

    @PostMapping
    public void saveJobGrade(@RequestBody JobGradeRequestDto dto) {
        jobGradeService.save(dto);
    }

    @PostMapping("/from-template")
    public void saveJobGrades(@RequestBody List<JobGradeRequestDto> dtos) {
        jobGradeService.saveList(dtos);
    }

    @PutMapping("/{id}")
    public void updateJobGrade(@PathVariable Long id, @RequestBody JobGradeRequestDto dto) {
        jobGradeService.update(id, dto);
    }

    @DeleteMapping
    public void deleteJobGrades(@RequestBody BulkDeleteRequestDto requestDto) {
        jobGradeService.delete(requestDto.getIds());
    }

    @PostMapping("/update-levels")
    public void updateGradeLevels(@RequestBody List<JobGradeRequestDto> dtos) {
        jobGradeService.updateLevels(dtos);
    }
}
