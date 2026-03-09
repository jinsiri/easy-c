package org.easyc.memberJobPositionMap.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.memberJobPositionMap.entity.MemberJobPositionMap;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MemberJobPositionMapResponseDto extends BaseDto {
    private Long memberJobPositionMapId;
    private Long memberId;
    private Long jobPositionId;

    private String jobPositionNm;

    public MemberJobPositionMapResponseDto(MemberJobPositionMap entity) {
        this.memberJobPositionMapId = entity.getMemberJobPositionMapId();
        this.memberId = entity.getMemberId();
        this.jobPositionId = entity.getJobPositionId();
    }
}
