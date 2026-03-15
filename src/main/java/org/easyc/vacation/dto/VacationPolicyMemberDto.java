package org.easyc.vacation.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.AuditUser;
import org.easyc.common.support.EnumOptionMapper;
import org.easyc.member.constant.AccountStatus;
import org.easyc.member.constant.EmploymentStatus;
import org.easyc.member.constant.EmploymentType;
import org.easyc.member.constant.MemberRole;
import org.easyc.member.dto.MemberLightResponseDto;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;

@Getter
@Setter
@SuperBuilder
public class VacationPolicyMemberDto extends MemberLightResponseDto {
    private Long vacationPolicyId;
    private String vacationPolicyName;

    @QueryProjection
    public VacationPolicyMemberDto(
            Long memberId, String memberNm, String loginId, MemberRole memberRole, AccountStatus accountStatus,
            String employeeId, String email, EmploymentType employmentType, EmploymentStatus employmentStatus,
            String phoneNumber,
            String deptNm, String jobTitle, String jobPosition,
            boolean deleted, boolean active,
            LocalDateTime registerDate, String registerIp, AuditUser registerUser,
            LocalDateTime lastUpdateDate, String lastUpdateIp, AuditUser lastUpdateUser,
            Long vacationPolicyId,
            String vacationPolicyName
    ) {
        super(memberId,memberNm,loginId,memberRole,accountStatus,
                employeeId, email, employmentType, employmentStatus,
                phoneNumber, deptNm, jobTitle, jobPosition,
                deleted, active, registerDate, registerIp, registerUser, lastUpdateDate, lastUpdateIp, lastUpdateUser);
        this.vacationPolicyId = vacationPolicyId;
        this.vacationPolicyName = vacationPolicyName;
    }
}
