package org.easyc.memberJobRoleMap.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.memberJobRoleMap.entity.MemberJobRoleMap;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MemberJobRoleMapResponseDto extends BaseDto {
    private Long memberJobRoleMapId;
    private Long memberId;
    private Long jobRoleId;

    private String jobRoleNm;
    private String jobRoleCategory;
    private String jobRoleType;

    public MemberJobRoleMapResponseDto(MemberJobRoleMap entity) {
        this.memberJobRoleMapId = entity.getMemberJobRoleMapId();
        this.memberId = entity.getMemberId();
        this.jobRoleId = entity.getJobRoleId();
    }
}
