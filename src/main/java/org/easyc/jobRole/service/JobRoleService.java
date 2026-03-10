package org.easyc.jobRole.service;

import lombok.RequiredArgsConstructor;
import org.easyc.jobRole.dto.JobRoleRequestDto;
import org.easyc.jobRole.dto.JobRoleResponseDto;
import org.easyc.jobRole.entity.JobRole;
import org.easyc.jobRole.repository.JobRoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobRoleService {
    private final JobRoleRepository jobRoleRepository;

    public List<JobRoleResponseDto> findAll() {
        List<JobRole> jobRole = jobRoleRepository.findAll();

        return JobRoleResponseDto.fromEntityList(jobRole);
    }

    public void save(JobRoleRequestDto jobRoleRequestDto) {
        JobRole jobRole = jobRoleRequestDto.toEntity();
        jobRoleRepository.save(jobRole);
    }
}
