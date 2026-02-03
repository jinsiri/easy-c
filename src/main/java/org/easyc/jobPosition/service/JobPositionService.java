package org.easyc.jobPosition.service;

import lombok.RequiredArgsConstructor;
import org.easyc.jobPosition.dto.JobPositionRequestDto;
import org.easyc.jobPosition.dto.JobPositionResponseDto;
import org.easyc.jobPosition.entity.JobPosition;
import org.easyc.jobPosition.repository.JobPositionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobPositionService {
    private final JobPositionRepository jobPositionRepository;
    
    public List<JobPositionResponseDto> findAll() {
        List<JobPosition> jobPosition = jobPositionRepository.findAll();

        return JobPositionResponseDto.fromEntityList(jobPosition);
    }

    public void save(JobPositionRequestDto jobPositionRequestDto) {
        JobPosition jobPosition = jobPositionRequestDto.toEntity();

        // todo: 작성자 세팅해야함
        jobPositionRepository.save(jobPosition);
    }
}
