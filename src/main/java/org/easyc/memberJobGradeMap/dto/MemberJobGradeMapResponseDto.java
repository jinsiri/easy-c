package org.easyc.memberJobGradeMap.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class MemberJobGradeMapResponseDto extends BaseDto {
    private Long memberJobGradeMapId;
    private Long memberId;
    private Long jobGradeId;
}
