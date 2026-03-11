package org.easyc.jobRole.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.jobRole.entity.JobRole;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class JobRoleRequestDto extends BaseDto {
    private Long jobRoleId;
    private String jobRoleCategory;
    private String jobRoleType;
    private String jobRoleNm;
    private int jobRoleOrder;

    public JobRole toEntity() {
        return JobRole.builder()
                .jobRoleId(jobRoleId)
                .jobRoleCategory(jobRoleCategory)
                .jobRoleType(jobRoleType)
                .jobRoleNm(jobRoleNm)
                .jobRoleOrder(jobRoleOrder)
                .build()
                ;
    }
}
