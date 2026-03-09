package org.easyc.memberJobGradeMap.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.memberJobGradeMap.entity.MemberJobGradeMap;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MemberJobGradeMapResponseDto extends BaseDto {
    private Long memberJobGradeMapId;
    private Long memberId;
    private Long jobGradeId;

    private String jobGradeNm;

    public MemberJobGradeMapResponseDto(MemberJobGradeMap entity) {
        this.memberJobGradeMapId = entity.getMemberJobGradeMapId();
        this.memberId = entity.getMemberId();
        this.jobGradeId = entity.getJobGradeId();
    }
}
