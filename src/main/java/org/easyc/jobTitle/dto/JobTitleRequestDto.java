package org.easyc.jobTitle.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.jobTitle.entity.JobTitle;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class JobTitleRequestDto extends BaseDto {
    private Long jobTitleId;
    private String jobTitleNm;
    private String jobTitleCode;
    private int jobTitleLevel;

    public JobTitle toEntity() {
        return JobTitle.builder()
                .jobTitleId(jobTitleId)
                .jobTitleNm(jobTitleNm)
                .jobTitleCode(jobTitleCode)
                .jobTitleLevel(jobTitleLevel)
                .build()
                ;
    }
}
