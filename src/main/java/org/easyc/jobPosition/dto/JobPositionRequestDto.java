package org.easyc.jobPosition.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;

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
}
