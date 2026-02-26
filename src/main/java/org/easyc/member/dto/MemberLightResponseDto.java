package org.easyc.member.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.AuditUser;
import org.easyc.common.dto.BaseDto;
import org.easyc.common.support.EnumOptionMapper;
import org.easyc.member.constant.AccountStatus;
import org.easyc.member.constant.EmploymentStatus;
import org.easyc.member.constant.EmploymentType;
import org.easyc.member.constant.MemberRole;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
public class MemberLightResponseDto extends BaseDto {

    // member
    private Long memberId;
    private String memberNm;
    private String loginId;
    private String memberRole;
    private String accountStatus;
    // profile
    private String employeeId;
    private String email;
    private String employmentType;
    private String employmentStatus;
    // personal
    private String phoneNumber;
    // dept
    private String deptNm;
    private Set<String> deptNms = new LinkedHashSet<>();
    private String jobTitle;
    private String jobPosition;

    @QueryProjection
    public MemberLightResponseDto(
            Long memberId, String memberNm, String loginId, MemberRole memberRole, AccountStatus accountStatus,
            String employeeId, String email, EmploymentType employmentType, EmploymentStatus employmentStatus,
            String phoneNumber,
            String deptNm, String jobTitle, String jobPosition,
            boolean deleted, boolean active,
            LocalDateTime registerDate, String registerIp, AuditUser registerUser, //String registerId, String registerNm,
            LocalDateTime lastUpdateDate, String lastUpdateIp, AuditUser lastUpdateUser //String lastUpdateId, String lastUpdateNm
    ) {
//        super(deleted, active, registerDate, registerIp, registerUser, lastUpdateDate, lastUpdateIp, lastUpdateId, lastUpdateNm);
        super(deleted, active, registerDate, registerIp, registerUser, lastUpdateDate, lastUpdateIp, lastUpdateUser);
        this.memberId = memberId;
        this.memberNm = memberNm;
        this.loginId = loginId;
        this.memberRole = EnumOptionMapper.getLabel(memberRole, "member.role");
        this.accountStatus = EnumOptionMapper.getLabel(accountStatus, "account.status");
        this.employeeId = employeeId;
        this.email = email;
        this.employmentType = EnumOptionMapper.getLabel(employmentType, "employment.type");
        this.employmentStatus = EnumOptionMapper.getLabel(employmentStatus, "employment.status");
        this.phoneNumber = phoneNumber;
        this.deptNm = deptNm;
        this.jobTitle = jobTitle;
        this.jobPosition = jobPosition;
    }
}
