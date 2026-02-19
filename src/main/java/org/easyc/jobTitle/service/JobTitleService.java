package org.easyc.jobTitle.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.jobTitle.dto.JobTitleRequestDto;
import org.easyc.jobTitle.dto.JobTitleResponseDto;
import org.easyc.jobTitle.entity.JobTitle;
import org.easyc.jobTitle.repository.JobTitleRepository;
import org.easyc.jobTitle.repository.JobTitleRepositoryCustom;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobTitleService {
    private final JobTitleRepository jobTitleRepository;
    private final JobTitleRepositoryCustom jobTitleRepositoryCustom;

    public List<JobTitleResponseDto> findAll() {
        return jobTitleRepositoryCustom.findAllWithMemberCountOrderByLevel();
    }

    @Transactional(readOnly = true)
    public JobTitleResponseDto findById(Long id) {
        JobTitle title = jobTitleRepository.findById(id)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND));
        return JobTitleResponseDto.fromEntity(title);
    }

    /**
     * 중복 검증 및 엔티티 생성 공통 로직
     */
    private JobTitle createValidatedEntity(JobTitleRequestDto dto, int level) {
        if (jobTitleRepository.existsByJobTitleNm(dto.getJobTitleNm())) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_DUPLICATE_NM);
        }

        if (jobTitleRepository.existsByJobTitleCode(dto.getJobTitleCode())) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_DUPLICATE_CODE);
        }

        return JobTitle.builder()
                .jobTitleNm(dto.getJobTitleNm())
                .jobTitleCode(dto.getJobTitleCode())
                .jobTitleLevel(level)
                .deleted(false)
                .active(true)
                .build();
    }

    /**
     *  직책 단건 추가
     * */
    @Transactional
    public void save(JobTitleRequestDto dto) {
        int nextLevel = jobTitleRepository.findMaxLevel().orElse(0) + 1;
        jobTitleRepository.save(createValidatedEntity(dto, nextLevel));
    }

    /**
     *  직책 일괄 추가(템플릿 활용)
     * */
    @Transactional
    public void saveList(List<JobTitleRequestDto> dtos) {
        int currentMaxLevel = jobTitleRepository.findMaxLevel().orElse(0);

        List<JobTitle> entities = new ArrayList<>();
        for (int i = 0; i < dtos.size(); i++) {
            entities.add(createValidatedEntity(dtos.get(i), currentMaxLevel + i + 1));
        }

        jobTitleRepository.saveAll(entities);
    }

    /**
     *  직책 수정
     * */
    @Transactional
    public void update(Long id, JobTitleRequestDto dto) {
        JobTitle title = jobTitleRepository.findById(id)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND));

        title.updateInfo(dto.getJobTitleNm(), dto.getJobTitleCode());
    }

    /**
     *  직책 일괄 삭제
     * */
    @Transactional
    public void delete(Set<Long> titleIds) {
        List<JobTitle> titles = jobTitleRepository.findAllById(titleIds);

        if(titles.size() != titleIds.size()) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND);
        }

        for(JobTitle title : titles) {
            title.delete();
        }
    }

    @Transactional
    public void updateLevels(List<JobTitleRequestDto> dtos) {
        List<Long> ids = dtos.stream()
                .map(JobTitleRequestDto::getJobTitleId)
                .toList();

        List<JobTitle> titles = jobTitleRepository.findAllById(ids);

        Map<Long, JobTitle> gradeMap = titles.stream()
                .collect(Collectors.toMap(JobTitle::getJobTitleId, g -> g));

        for (JobTitleRequestDto dto : dtos) {
            JobTitle title = gradeMap.get(dto.getJobTitleId());
            if (title != null) {
                title.changeLevel(dto.getJobTitleLevel());
            }
        }
    }
}
