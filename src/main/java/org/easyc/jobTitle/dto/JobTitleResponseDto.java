package org.easyc.jobTitle.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;

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
}
