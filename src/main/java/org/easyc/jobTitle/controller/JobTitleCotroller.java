package org.easyc.jobTitle.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.common.dto.BulkDeleteRequestDto;
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

    @GetMapping("/{id}")
    public JobTitleResponseDto findById(@PathVariable Long id) {
        return jobTitleService.findById(id);
    }

    @PostMapping
    public void saveJobTitle(@RequestBody JobTitleRequestDto dto) {
        jobTitleService.save(dto);
    }

    @PostMapping("/from-template")
    public void saveJobTitles(@RequestBody List<JobTitleRequestDto> dtos) {
        jobTitleService.saveList(dtos);
    }

    @PutMapping("/{id}")
    public void updateJobTitle(@PathVariable Long id, @RequestBody JobTitleRequestDto dto) {
        jobTitleService.update(id, dto);
    }

    @DeleteMapping
    public void deleteJobTitles(@RequestBody BulkDeleteRequestDto requestDto) {
        jobTitleService.delete(requestDto.getIds());
    }

    @PostMapping("/update-levels")
    public void updateTitleLevels(@RequestBody List<JobTitleRequestDto> dtos) {
        jobTitleService.updateLevels(dtos);
    }
}
