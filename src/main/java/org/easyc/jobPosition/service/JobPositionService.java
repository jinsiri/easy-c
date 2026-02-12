package org.easyc.jobPosition.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.jobPosition.dto.JobPositionRequestDto;
import org.easyc.jobPosition.dto.JobPositionResponseDto;
import org.easyc.jobPosition.entity.JobPosition;
import org.easyc.jobPosition.repository.JobPositionRepository;
import org.easyc.jobPosition.repository.JobPositionRepositoryCustom;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class JobPositionService {
    private final JobPositionRepository jobPositionRepository;
    private final JobPositionRepositoryCustom jobPositionRepositoryCustom;

    public List<JobPositionResponseDto> findAll() {
        return jobPositionRepositoryCustom.findAllWithMemberCountOrderByLevel();
    }

    @Transactional
    public void save(JobPositionRequestDto jobPositionRequestDto) {
        if (jobPositionRepository.existsByJobPositionNm(jobPositionRequestDto.getJobPositionNm())) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_DUPLICATE_NM);
        }

        if (jobPositionRepository.existsByJobPositionCode(jobPositionRequestDto.getJobPositionCode())) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_DUPLICATE_CODE);
        }

        JobPosition jobPosition = jobPositionRequestDto.toEntity();
        jobPositionRepository.save(jobPosition);
    }

    @Transactional
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

    @Transactional
    public void delete(Set<Long> positionIds) {
        List<JobPosition> positions = jobPositionRepository.findAllById(positionIds);

        if(positions.size() != positionIds.size()) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND);
        }

        for(JobPosition position : positions) {
            position.delete();
        }
    }
}
