package org.easyc.memberJobGradeMap.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;

import java.util.Set;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class MemberJobGradeMapRequestDto extends BaseDto {
    private Long memberJobGradeMapId;
    private Long memberId;
    private Long jobGradeId;

    private Set<Long> memberIds;
}
