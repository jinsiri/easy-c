package org.easyc.jobRole.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.jobRole.dto.JobRoleRequestDto;
import org.easyc.jobRole.dto.JobRoleResponseDto;
import org.easyc.jobRole.entity.JobRole;
import org.easyc.jobRole.repository.JobRoleRepository;
import org.easyc.jobRole.repository.JobRoleRepositoryCustom;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobRoleService {
    private final JobRoleRepository jobRoleRepository;
    private final JobRoleRepositoryCustom jobRoleRepositoryCustom;

    public List<JobRoleResponseDto> findAll() {
        return jobRoleRepositoryCustom.findAllWithMemberCountOrderByOrder();
    }

    @Transactional(readOnly = true)
    public JobRoleResponseDto findById(Long id) {
        JobRole role = jobRoleRepository.findById(id)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND));
        return JobRoleResponseDto.fromEntity(role);
    }

    /**
     * 중복 검증 및 엔티티 생성 공통 로직
     */
    private JobRole createValidatedEntity(JobRoleRequestDto dto, int level) {
        if (jobRoleRepository.existsByJobRoleNm(dto.getJobRoleNm())) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_DUPLICATE_NM);
        }

        return JobRole.builder()
                .jobRoleNm(dto.getJobRoleNm())
                .jobRoleCategory(dto.getJobRoleCategory())
                .jobRoleType(dto.getJobRoleType())
                .jobRoleNm(dto.getJobRoleNm())
                .jobRoleOrder(dto.getJobRoleOrder())
                .deleted(false)
                .active(true)
                .build();
    }

    /**
     *  직무 단건 추가
     * */
    @Transactional
    public void save(JobRoleRequestDto dto) {
        int nextLevel = jobRoleRepository.findMaxLevel().orElse(0) + 1;
        jobRoleRepository.save(createValidatedEntity(dto, nextLevel));
    }

    /**
     *  직무 수정
     * */
    @Transactional
    public void update(Long id, JobRoleRequestDto dto) {
        JobRole role = jobRoleRepository.findById(id)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND));

        role.updateInfo(dto.getJobRoleNm(), dto.getJobRoleCategory(), dto.getJobRoleType());
    }

    /**
     *  직무 일괄 삭제
     * */
    @Transactional
    public void delete(Set<Long> roleIds) {
        List<JobRole> roles = jobRoleRepository.findAllById(roleIds);

        if(roles.size() != roleIds.size()) {
            throw new CustomException(CustomExceptionCode.MEMBER_JOB_NOT_FOUND);
        }

        for(JobRole role : roles) {
            role.delete();
        }
    }

    @Transactional
    public void updateOrders(List<JobRoleRequestDto> dtos) {
        List<Long> ids = dtos.stream()
                .map(JobRoleRequestDto::getJobRoleId)
                .toList();

        List<JobRole> roles = jobRoleRepository.findAllById(ids);

        Map<Long, JobRole> roleMap = roles.stream()
                .collect(Collectors.toMap(JobRole::getJobRoleId, g -> g));

        for (JobRoleRequestDto dto : dtos) {
            JobRole role = roleMap.get(dto.getJobRoleId());
            if (role != null) {
                role.changeOrder(dto.getJobRoleOrder());
            }
        }
    }
}
