package org.easyc.deptMemberMap.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.deptMemberMap.constant.DeptRole;
import org.easyc.deptMemberMap.entity.DeptMemberMap;
import java.util.Set;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class DeptMemberMapRequestDto extends BaseDto {
    private Long deptMemberMapId;
    private Long deptId;
    private Long memberId;
    private Long jobTitleId;
    private DeptRole deptRole;
    private boolean isPrimary;

    private Set<Long> memberIds;
    private Long prevDeptId;
    private Long targetDeptId;

    public DeptMemberMap toEntity(DeptMemberMapRequestDto deptMemberMapRequestDto) {
        return DeptMemberMap.builder()
                .deptMemberMapId(deptMemberMapRequestDto.getDeptMemberMapId())
                .deptId(deptMemberMapRequestDto.getDeptId())
                .memberId(deptMemberMapRequestDto.getMemberId())
                .jobTitleId(deptMemberMapRequestDto.getJobTitleId())
                .deptRole(deptMemberMapRequestDto.getDeptRole())
                .isPrimary(deptMemberMapRequestDto.isPrimary())
                .build();
    }
}
