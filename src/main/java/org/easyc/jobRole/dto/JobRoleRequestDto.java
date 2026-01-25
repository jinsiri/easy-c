package org.easyc.jobRole.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class JobRoleRequestDto extends BaseDto {
    private Long jobRoleId;
    private String jobRoleCategory;
    private String jobRoleType;
    private int jobRoleNm;

}
