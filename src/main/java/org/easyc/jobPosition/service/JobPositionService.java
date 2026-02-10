package org.easyc.jobPosition.service;

import lombok.RequiredArgsConstructor;
import org.easyc.jobPosition.dto.JobPositionRequestDto;
import org.easyc.jobPosition.dto.JobPositionResponseDto;
import org.easyc.jobPosition.entity.JobPosition;
import org.easyc.jobPosition.repository.JobPositionRepository;
import org.easyc.jobPosition.repository.JobPositionRepositoryCustom;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobPositionService {
    private final JobPositionRepository jobPositionRepository;
    private final JobPositionRepositoryCustom jobPositionRepositoryCustom;
    
    public List<JobPositionResponseDto> findAll() {
        return jobPositionRepositoryCustom.findAllWithMemberCountOrderByLevel();
    }

    public void save(JobPositionRequestDto jobPositionRequestDto) {
        JobPosition jobPosition = jobPositionRequestDto.toEntity();
        jobPositionRepository.save(jobPosition);
    }
}
