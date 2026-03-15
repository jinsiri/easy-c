package org.easyc.memberJobRoleMap.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;

import java.util.Set;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class MemberJobRoleMapRequestDto extends BaseDto {
    private Long memberJobRoleMapId;
    private Long memberId;
    private Long jobRoleId;

    private Set<Long> memberIds;
}
