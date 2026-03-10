package org.easyc.jobPosition.service;

import org.springframework.transaction.annotation.Transactional;
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
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPositionService {
    private final JobPositionRepository jobPositionRepository;
    private final JobPositionRepositoryCustom jobPositionRepositoryCustom;

    public List<JobPositionResponseDto> findAll() {
        return jobPositionRepositoryCustom.findAllWithMemberCountOrderByLevel();
    }

    @Transactional(readOnly = true)
    public JobPositionResponseDto findById(Long id) {
        JobPosition position = jobPositionRepository.findById(id)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND));
        return JobPositionResponseDto.fromEntity(position);
    }

    /**
     * 중복 검증 및 엔티티 생성 공통 로직
     */
    private JobPosition createValidatedEntity(JobPositionRequestDto dto, int level) {
        if (jobPositionRepository.existsByJobPositionNm(dto.getJobPositionNm())) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_DUPLICATE_NM);
        }

        if (jobPositionRepository.existsByJobPositionCode(dto.getJobPositionCode())) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_DUPLICATE_CODE);
        }

        return JobPosition.builder()
                .jobPositionNm(dto.getJobPositionNm())
                .jobPositionCode(dto.getJobPositionCode())
                .jobPositionLevel(level)
                .deleted(false)
                .active(true)
                .build();
    }

    /**
     *  직위 단건 추가
     * */
    @Transactional
    public void save(JobPositionRequestDto dto) {
        int nextLevel = jobPositionRepository.findMaxLevel().orElse(0) + 1;
        jobPositionRepository.save(createValidatedEntity(dto, nextLevel));
    }

    /**
     *  직위 일괄 추가(템플릿 활용)
     * */
    @Transactional
    public void saveList(List<JobPositionRequestDto> dtos) {
        int currentMaxLevel = jobPositionRepository.findMaxLevel().orElse(0);

        List<JobPosition> entities = new ArrayList<>();
        for (int i = 0; i < dtos.size(); i++) {
            entities.add(createValidatedEntity(dtos.get(i), currentMaxLevel + i + 1));
        }

        jobPositionRepository.saveAll(entities);
    }

    /**
     *  직위 수정
     * */
    @Transactional
    public void update(Long id, JobPositionRequestDto dto) {
        JobPosition position = jobPositionRepository.findById(id)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND));

        position.updateInfo(dto.getJobPositionNm(), dto.getJobPositionCode());
    }

    /**
     *  직위 일괄 삭제
     * */
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

    @Transactional
    public void updateLevels(List<JobPositionRequestDto> dtos) {
        List<Long> ids = dtos.stream()
                .map(JobPositionRequestDto::getJobPositionId)
                .toList();

        List<JobPosition> positions = jobPositionRepository.findAllById(ids);

        Map<Long, JobPosition> positionMap = positions.stream()
                .collect(Collectors.toMap(JobPosition::getJobPositionId, g -> g));

        for (JobPositionRequestDto dto : dtos) {
            JobPosition position = positionMap.get(dto.getJobPositionId());
            if (position != null) {
                position.changeLevel(dto.getJobPositionLevel());
            }
        }
    }
}
