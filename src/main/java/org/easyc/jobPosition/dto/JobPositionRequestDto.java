package org.easyc.jobPosition.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.jobPosition.entity.JobPosition;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class JobPositionRequestDto extends BaseDto {
    private Long jobPositionId;
    private String jobPositionNm;
    private String jobPositionCode;
    private int jobPositionLevel;

    public JobPosition toEntity() {
        return JobPosition.builder()
                .jobPositionId(jobPositionId)
                .jobPositionNm(jobPositionNm)
                .jobPositionCode(jobPositionCode)
                .jobPositionLevel(jobPositionLevel)
                .build()
                ;
    }
}
