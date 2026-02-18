package org.easyc.memberJobPositionMap.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class MemberJobPositionMapRequestDto extends BaseDto {
    private Long memberJobPositionMapId;
    private Long memberId;
    private Long jobPositionId;
}
