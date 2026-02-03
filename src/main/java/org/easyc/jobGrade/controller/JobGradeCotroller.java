package org.easyc.jobGrade.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.jobGrade.service.JobGradeService;
import org.easyc.jobPosition.dto.JobPositionRequestDto;
import org.easyc.jobPosition.dto.JobPositionResponseDto;
import org.easyc.jobPosition.service.JobPositionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/job-grades")
public class JobGradeCotroller {
    private final JobGradeService jobGradeService;
    // todo: 메서드명 작성 규칙 정하기
    //조회: findAll()
    //추가: save()
    //수정: update()
    //삭제: delete()

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
