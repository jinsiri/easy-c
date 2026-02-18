package org.easyc.jobPosition.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @PostMapping
    public void saveJobPosition(@RequestBody JobPositionRequestDto dto) {
        jobPositionService.save(dto);
    }

    @PostMapping("/from-template")
    public void saveJobPositions(@RequestBody List<JobPositionRequestDto> dtos) {
        jobPositionService.saveList(dtos);
    }

    @PutMapping("/{id}")
    public void updateJobPosition(@PathVariable Long id, @RequestBody JobPositionRequestDto dto) {
        jobPositionService.update(id, dto);
    }

    @DeleteMapping
    public void deleteJobPositions(@RequestBody BulkDeleteRequestDto requestDto) {
        jobPositionService.delete(requestDto.getIds());
    }

    @PostMapping("/update-levels")
    public void updateGradeLevels(@RequestBody List<JobPositionRequestDto> dtos) {
        jobPositionService.updateLevels(dtos);
    }
}
