package org.easyc.memberBundle.service;

import lombok.RequiredArgsConstructor;
import org.easyc.dept.service.DeptService;
import org.easyc.jobGrade.service.JobGradeService;
import org.easyc.jobPosition.service.JobPositionService;
import org.easyc.jobRole.service.JobRoleService;
import org.easyc.jobTitle.service.JobTitleService;
import org.easyc.memberBundle.dto.MemberBundleResponseDto;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberBundleService {
    private final DeptService deptService;
    private final JobTitleService jobTitleService;
    private final JobPositionService jobPositionService;
    private final JobGradeService jobGradeService;
    private final JobRoleService jobRoleService;

    public MemberBundleResponseDto getMemberBundle() {
        return MemberBundleResponseDto.builder()
                .deptList(deptService.getDeptTree())
                .jobTitleList(jobTitleService.findAll())
                .jobPositionList(jobPositionService.findAll())
                .jobGradeList(jobGradeService.findAll())
                .jobRoleList(jobRoleService.findAll())
                .build();
    }
}
