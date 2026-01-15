package org.easyc.jobGrade.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.jobGrade.dto.JobGradeRequestDto;
import org.easyc.jobGrade.dto.JobGradeResponseDto;
import org.easyc.jobGrade.service.JobGradeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public ResponseEntity<List<JobGradeResponseDto>> findAll() {
        try {
            List<JobGradeResponseDto> tree = jobGradeService.findAll();
            return ResponseEntity.ok(tree);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Void> save(@RequestBody JobGradeRequestDto dto) {
        jobGradeService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
