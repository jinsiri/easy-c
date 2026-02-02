package org.easyc.jobPosition.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.jobPosition.dto.JobPositionRequestDto;
import org.easyc.jobPosition.dto.JobPositionResponseDto;
import org.easyc.jobPosition.service.JobPositionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/job-position")
public class JobPositionController {
    private final JobPositionService jobPositionService;

    @GetMapping
    public List<JobPositionResponseDto> findAll() {
        return jobPositionService.findAll();
    }

    @PostMapping
    public void save(@RequestBody JobPositionRequestDto dto) {
        jobPositionService.save(dto);
    }
}
