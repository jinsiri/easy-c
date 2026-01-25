package org.easyc.jobGrade.service;

import lombok.RequiredArgsConstructor;
import org.easyc.jobGrade.dto.JobGradeRequestDto;
import org.easyc.jobGrade.dto.JobGradeResponseDto;
import org.easyc.jobGrade.entity.JobGrade;
import org.easyc.jobGrade.repository.JobGradeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobGradeService {
    private final JobGradeRepository jobGradeRepository;

    public List<JobGradeResponseDto> findAll() {
        List<JobGrade> jobGrades = jobGradeRepository.findAll();

        return JobGradeResponseDto.fromEntityList(jobGrades);
    }

    public void save(JobGradeRequestDto jobGradeRequestDto) {
        JobGrade jobGrade = jobGradeRequestDto.toEntity();

        // todo: 작성자 세팅해야함
        jobGradeRepository.save(jobGrade);
    }
}
