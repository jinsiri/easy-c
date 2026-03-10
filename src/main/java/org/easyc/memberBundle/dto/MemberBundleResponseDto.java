package org.easyc.memberBundle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.easyc.dept.dto.DeptResponseDto;
import org.easyc.jobGrade.dto.JobGradeResponseDto;
import org.easyc.jobPosition.dto.JobPositionResponseDto;
import org.easyc.jobRole.dto.JobRoleResponseDto;
import org.easyc.jobTitle.dto.JobTitleResponseDto;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberBundleResponseDto {
    private List<DeptResponseDto> deptList;
    private List<JobTitleResponseDto> jobTitleList;
    private List<JobPositionResponseDto> jobPositionList;
    private List<JobGradeResponseDto> jobGradeList;
    private List<JobRoleResponseDto> jobRoleList;
}
