package org.easyc.jobGrade.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.jobGrade.entity.JobGrade;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED) // todo: 액세스레벨 체크
@EqualsAndHashCode(callSuper = true)
public class JobGradeRequestDto extends BaseDto {
    private Long jobGradeId;
    private String jobGradeNm;
    private String jobGradeCode;
    private int jobGradeLevel;

    public JobGrade toEntity() {
        return JobGrade.builder()
                .jobGradeId(jobGradeId)
                .jobGradeNm(jobGradeNm)
                .jobGradeCode(jobGradeCode)
                .jobGradeLevel(jobGradeLevel)
                .build()
                ;
    }
}
