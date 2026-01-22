package org.easyc.jobTitle.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.jobTitle.entity.JobTitle;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class JobTitleResponseDto extends BaseDto {
    private Long jobTitleId;
    private String jobTitleNm;
    private String jobTitleCode;
    private int jobTitleLevel;

    public static JobTitleResponseDto fromEntity(JobTitle jobTitle) {
        return JobTitleResponseDto.builder()
                .jobTitleId(jobTitle.getJobTitleId())
                .jobTitleNm(jobTitle.getJobTitleNm())
                .jobTitleCode(jobTitle.getJobTitleCode())
                .jobTitleLevel(jobTitle.getJobTitleLevel())
                .active(jobTitle.isActive())
                .registerDate(jobTitle.getRegisterDate())
                .registerIp(jobTitle.getRegisterIp())
                .registerId(jobTitle.getRegisterId())
                .registerNm(jobTitle.getRegisterNm())
                .lastUpdateDate(jobTitle.getLastUpdateDate())
                .lastUpdateIp(jobTitle.getLastUpdateIp())
                .lastUpdateId(jobTitle.getLastUpdateId())
                .build();
    }

    public static List<JobTitleResponseDto> fromEntityList(List<JobTitle> JobTitleList) {
        return JobTitleList.stream().map(JobTitleResponseDto::fromEntity).collect(Collectors.toList());
    }
}
