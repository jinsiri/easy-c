package org.easyc.jobTitle.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.jobTitle.dto.JobTitleRequestDto;
import org.easyc.jobTitle.dto.JobTitleResponseDto;
import org.easyc.jobTitle.service.JobTitleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/job-titles")
public class JobTitleCotroller {
    private final JobTitleService jobTitleService;

    @GetMapping
    public List<JobTitleResponseDto> findAll() {
        return jobTitleService.findAll();
    }

    @PostMapping
    public void save(@RequestBody JobTitleRequestDto dto) {
        jobTitleService.save(dto);
    }
}
