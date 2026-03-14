package org.easyc.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.deptMemberMap.dto.DeptMemberMapRequestDto;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MemberOrgSettingRequestDto {
    private Long jobPositionId;
    private Long jobGradeId;
    private Long jobRoleId;
    private List<DeptMemberMapRequestDto> deptMemberMapList;
}
