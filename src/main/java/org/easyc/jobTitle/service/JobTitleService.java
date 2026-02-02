package org.easyc.jobTitle.service;

import lombok.RequiredArgsConstructor;
import org.easyc.jobTitle.dto.JobTitleRequestDto;
import org.easyc.jobTitle.dto.JobTitleResponseDto;
import org.easyc.jobTitle.entity.JobTitle;
import org.easyc.jobTitle.repository.JobTitleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobTitleService {
    private final JobTitleRepository jobTitleRepository;

    public List<JobTitleResponseDto> findAll() {
        List<JobTitle> jobTitle = jobTitleRepository.findAll();

        return JobTitleResponseDto.fromEntityList(jobTitle);
    }

    public void save(JobTitleRequestDto jobTitleRequestDto) {
        JobTitle jobTitle = jobTitleRequestDto.toEntity();

        // todo: 작성자 세팅해야함
        jobTitleRepository.save(jobTitle);
    }
}
