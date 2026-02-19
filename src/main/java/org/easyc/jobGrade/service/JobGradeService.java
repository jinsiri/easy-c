package org.easyc.jobGrade.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.jobGrade.dto.JobGradeRequestDto;
import org.easyc.jobGrade.dto.JobGradeResponseDto;
import org.easyc.jobGrade.entity.JobGrade;
import org.easyc.jobGrade.repository.JobGradeRepository;
import org.easyc.jobGrade.repository.JobGradeRepositoryCustom;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobGradeService {
    private final JobGradeRepository jobGradeRepository;
    private final JobGradeRepositoryCustom jobGradeRepositoryCustom;

    public List<JobGradeResponseDto> findAll() {
        return jobGradeRepositoryCustom.findAllWithMemberCountOrderByLevel();
    }

    @Transactional(readOnly = true)
    public JobGradeResponseDto findById(Long id) {
        JobGrade grade = jobGradeRepository.findById(id)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND));
        return JobGradeResponseDto.fromEntity(grade);
    }

    /**
     * 중복 검증 및 엔티티 생성 공통 로직
     */
    private JobGrade createValidatedEntity(JobGradeRequestDto dto, int level) {
        if (jobGradeRepository.existsByJobGradeNm(dto.getJobGradeNm())) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_DUPLICATE_NM);
        }

        if (jobGradeRepository.existsByJobGradeCode(dto.getJobGradeCode())) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_DUPLICATE_CODE);
        }

        return JobGrade.builder()
                .jobGradeNm(dto.getJobGradeNm())
                .jobGradeCode(dto.getJobGradeCode())
                .jobGradeLevel(level)
                .deleted(false)
                .active(true)
                .build();
    }

    /**
     *  직급 단건 추가
     * */
    @Transactional
    public void save(JobGradeRequestDto dto) {
        int nextLevel = jobGradeRepository.findMaxLevel().orElse(0) + 1;
        jobGradeRepository.save(createValidatedEntity(dto, nextLevel));
    }

    /**
     *  직급 일괄 추가(템플릿 활용)
     * */
    @Transactional
    public void saveList(List<JobGradeRequestDto> dtos) {
        int currentMaxLevel = jobGradeRepository.findMaxLevel().orElse(0);

        List<JobGrade> entities = new ArrayList<>();
        for (int i = 0; i < dtos.size(); i++) {
            entities.add(createValidatedEntity(dtos.get(i), currentMaxLevel + i + 1));
        }

        jobGradeRepository.saveAll(entities);
    }

    /**
     *  직급 수정
     * */
    @Transactional
    public void update(Long id, JobGradeRequestDto dto) {
        JobGrade grade = jobGradeRepository.findById(id)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND));

        grade.updateInfo(dto.getJobGradeNm(), dto.getJobGradeCode());
    }

    /**
     *  직급 일괄 삭제
     * */
    @Transactional
    public void delete(Set<Long> gradeIds) {
        List<JobGrade> grades = jobGradeRepository.findAllById(gradeIds);

        if(grades.size() != gradeIds.size()) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND);
        }

        for(JobGrade grade : grades) {
            grade.delete();
        }
    }

    @Transactional
    public void updateLevels(List<JobGradeRequestDto> dtos) {
        List<Long> ids = dtos.stream()
                .map(JobGradeRequestDto::getJobGradeId)
                .toList();

        List<JobGrade> grades = jobGradeRepository.findAllById(ids);

        Map<Long, JobGrade> gradeMap = grades.stream()
                .collect(Collectors.toMap(JobGrade::getJobGradeId, g -> g));

        for (JobGradeRequestDto dto : dtos) {
            JobGrade grade = gradeMap.get(dto.getJobGradeId());
            if (grade != null) {
                grade.changeLevel(dto.getJobGradeLevel());
            }
        }
    }
}
