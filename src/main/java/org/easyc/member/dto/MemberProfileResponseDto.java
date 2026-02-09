package org.easyc.member.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.common.dto.EnumOption;
import org.easyc.common.support.EnumOptionMapper;
import org.easyc.member.entity.MemberProfile;

import java.time.LocalDate;

@Getter
@SuperBuilder
public class MemberProfileResponseDto extends BaseDto {
    private Long memberId;

//    private RecruitmentType recruitmentType;
//    private EmploymentType employmentType;
//    private SalaryType salaryType;
//    private EmploymentStatus employmentStatus;

    private EnumOption recruitmentType;
    private EnumOption employmentType;
    private EnumOption salaryType;
    private EnumOption employmentStatus;

    private String employeeId;
    private String email;
    private String extensionNumber;
    private String referredBy;
    private LocalDate resignationDate;
    private LocalDate hireDate;


    public static MemberProfileResponseDto fromEntity(MemberProfile memberProfile) {
        return MemberProfileResponseDto.builder()
                .memberId(memberProfile.getMemberId())
                .recruitmentType(EnumOptionMapper.toOption(memberProfile.getRecruitmentType(), "recruitment.type"))
                .employmentType(EnumOptionMapper.toOption(memberProfile.getEmploymentType(), "employment.type"))
                .salaryType(EnumOptionMapper.toOption(memberProfile.getSalaryType(), "salary.type"))
                .employmentStatus(EnumOptionMapper.toOption(memberProfile.getEmploymentStatus(), "employment.status"))
                .employeeId(memberProfile.getEmployeeId())
                .email(memberProfile.getEmail())
                .extensionNumber(memberProfile.getExtensionNumber())
                .referredBy(memberProfile.getReferredBy())
                .resignationDate(memberProfile.getResignationDate())
                .hireDate(memberProfile.getHireDate())
                .deleted(memberProfile.isDeleted())
                .active(memberProfile.isActive())
                .registerDate(memberProfile.getRegisterDate())
                .registerIp(memberProfile.getRegisterIp())
                .registerUser(memberProfile.getRegisterUser())
                .lastUpdateDate(memberProfile.getLastUpdateDate())
                .lastUpdateIp(memberProfile.getLastUpdateIp())
                .lastUpdateId(memberProfile.getLastUpdateId())
                .lastUpdateNm(memberProfile.getLastUpdateNm())
                .build();
    }
}
