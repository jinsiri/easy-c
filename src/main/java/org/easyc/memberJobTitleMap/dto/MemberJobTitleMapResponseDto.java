package org.easyc.memberJobTitleMap.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class MemberJobTitleMapResponseDto extends BaseDto {
    private Long memberJobTitleMapId;
    private Long memberId;
    private Long jobTitleId;
}
