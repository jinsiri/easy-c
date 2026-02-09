package org.easyc.member.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.common.dto.BaseUserDto;
import org.easyc.common.support.EnumOptionMapper;
import org.easyc.member.constant.AccountStatus;
import org.easyc.member.constant.EmploymentStatus;
import org.easyc.member.constant.EmploymentType;
import org.easyc.member.constant.MemberRole;

import java.time.LocalDateTime;

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
    //
    private String positionTitle;
    private String deptNm;


    public MemberLightResponseDto(
            Long memberId, String memberNm, String loginId, MemberRole memberRole, AccountStatus accountStatus,
            String employeeId, String email, EmploymentType employmentType, EmploymentStatus employmentStatus,
            String phoneNumber,
//            String positionTitle, String deptNm,
            boolean deleted, boolean active,
            LocalDateTime registerDate, String registerIp, BaseUserDto registerUser, //String registerId, String registerNm,
            LocalDateTime lastUpdateDate, String lastUpdateIp, String lastUpdateId, String lastUpdateNm
    ) {
        super(deleted, active, registerDate, registerIp, registerUser, lastUpdateDate, lastUpdateIp, lastUpdateId, lastUpdateNm);
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
//        this.positionTitle = positionTitle;
//        this.deptNm = deptNm;
    }
}
