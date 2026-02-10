package org.easyc.jobPosition.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.jobPosition.entity.JobPosition;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class JobPositionResponseDto extends BaseDto {
    private Long jobPositionId;
    private String jobPositionNm;
    private String jobPositionCode;
    private int jobPositionLevel;

    public static JobPositionResponseDto fromEntity(JobPosition jobPosition) {
        return JobPositionResponseDto.builder()
                .jobPositionId(jobPosition.getJobPositionId())
                .jobPositionNm(jobPosition.getJobPositionNm())
                .jobPositionCode(jobPosition.getJobPositionCode())
                .jobPositionLevel(jobPosition.getJobPositionLevel())
                .deleted(jobPosition.isDeleted())
                .active(jobPosition.isActive())
                .registerDate(jobPosition.getRegisterDate())
                .registerIp(jobPosition.getRegisterIp())
                .registerUser(jobPosition.getRegisterUser())
                .lastUpdateDate(jobPosition.getLastUpdateDate())
                .lastUpdateIp(jobPosition.getLastUpdateIp())
//                .lastUpdateId(jobPosition.getLastUpdateId())
                .lastUpdateUser(jobPosition.getLastUpdateUser())
                .build();
    }

    public static List<JobPositionResponseDto> fromEntityList(List<JobPosition> JobPositionList) {
        return JobPositionList.stream().map(JobPositionResponseDto::fromEntity).collect(Collectors.toList());
    }
}
