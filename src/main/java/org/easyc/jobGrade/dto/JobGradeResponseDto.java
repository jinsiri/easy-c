package org.easyc.jobGrade.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;

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
}
