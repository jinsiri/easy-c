package org.easyc.jobGrade.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.jobGrade.entity.JobGrade;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class JobGradeResponseDto extends BaseDto {
    private Long jobGradeId;
    private String jobGradeNm;
    private String jobGradeCode;
    private int jobGradeLevel;

    public static JobGradeResponseDto fromEntity(JobGrade jobGrade) {
        return JobGradeResponseDto.builder()
                .jobGradeId(jobGrade.getJobGradeId())
                .jobGradeNm(jobGrade.getJobGradeNm())
                .jobGradeCode(jobGrade.getJobGradeCode())
                .jobGradeLevel(jobGrade.getJobGradeLevel())
                .deleted(jobGrade.isDeleted())
                .active(jobGrade.isActive())
                .registerDate(jobGrade.getRegisterDate())
                .registerIp(jobGrade.getRegisterIp())
                .registerUser(jobGrade.getRegisterUser())
                .lastUpdateDate(jobGrade.getLastUpdateDate())
                .lastUpdateIp(jobGrade.getLastUpdateIp())
                .lastUpdateId(jobGrade.getLastUpdateId())
                .build();
    }

    public static List<JobGradeResponseDto> fromEntityList(List<JobGrade> JobGrades) {
        return JobGrades.stream().map(JobGradeResponseDto::fromEntity).collect(Collectors.toList());
    }
}
