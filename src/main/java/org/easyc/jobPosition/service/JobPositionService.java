package org.easyc.jobPosition.service;

import lombok.RequiredArgsConstructor;
import org.easyc.jobPosition.dto.JobPositionRequestDto;
import org.easyc.jobPosition.dto.JobPositionResponseDto;
import org.easyc.jobPosition.entity.JobPosition;
import org.easyc.jobPosition.repository.JobPositionRepository;
import org.easyc.jobPosition.repository.JobPositionRepositoryCustom;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public void saveList(List<JobPositionRequestDto> selectedTemplates) {
        int currentMaxLevel = jobPositionRepository.findMaxLevel().orElse(0);

        List<JobPosition> newPositions = new ArrayList<>();
        for (int i = 0; i < selectedTemplates.size(); i++) {
            JobPositionRequestDto dto = selectedTemplates.get(i);

            JobPosition entity = JobPosition.builder()
                    .jobPositionNm(dto.getJobPositionNm())
                    .jobPositionCode(dto.getJobPositionCode())
                    .jobPositionLevel(currentMaxLevel + i + 1)
                    .deleted(false)
                    .active(true)
                    .build();

            newPositions.add(entity);
        }

        jobPositionRepository.saveAll(newPositions);
    }
}
