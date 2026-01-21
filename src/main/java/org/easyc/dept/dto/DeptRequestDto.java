package org.easyc.dept.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseTreeDto;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class DeptRequestDto extends BaseTreeDto {
    private Long deptId;
    private String deptNm;
    private String deptShortNm;
    private String deptCode;
    private String deptEmail;
}
