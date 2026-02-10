package org.easyc.jobRole.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.jobRole.entity.JobRole;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class JobRoleResponseDto extends BaseDto {
    private Long jobRoleId;
    private String jobRoleCategory;
    private String jobRoleType;
    private int jobRoleNm;

    public static JobRoleResponseDto fromEntity(JobRole jobRole) {
        return JobRoleResponseDto.builder()
                .jobRoleId(jobRole.getJobRoleId())
                .jobRoleCategory(jobRole.getJobRoleCategory())
                .jobRoleType(jobRole.getJobRoleType())
                .jobRoleNm(jobRole.getJobRoleNm())
                .deleted(jobRole.isDeleted())
                .active(jobRole.isActive())
                .registerDate(jobRole.getRegisterDate())
                .registerIp(jobRole.getRegisterIp())
                .registerUser(jobRole.getRegisterUser())
                .lastUpdateDate(jobRole.getLastUpdateDate())
                .lastUpdateIp(jobRole.getLastUpdateIp())
//                .lastUpdateId(jobRole.getLastUpdateId())
                .lastUpdateUser(jobRole.getLastUpdateUser())
                .build();
    }

    public static List<JobRoleResponseDto> fromEntityList(List<JobRole> JobRoleList) {
        return JobRoleList.stream().map(JobRoleResponseDto::fromEntity).collect(Collectors.toList());
    }
}
