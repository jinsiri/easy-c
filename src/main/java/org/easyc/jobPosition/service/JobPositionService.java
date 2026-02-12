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
}
