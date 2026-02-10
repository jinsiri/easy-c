package org.easyc.member.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.common.dto.EnumOption;
import org.easyc.common.support.EnumOptionMapper;
import org.easyc.member.entity.MemberQualification;

import java.time.LocalDate;
import java.util.List;

@Getter
@SuperBuilder
public class MemberQualificationResponseDto extends BaseDto {

    private Long memberQualificationId;
    private Long memberId;
    private EnumOption qualificationType;
    private String qualificationName;
    private String qualificationNumber;
    private String qualificationGrade;
    private String issuingOrganization;
    private LocalDate acquiredDate;
    private LocalDate suspendedDate;

    public static MemberQualificationResponseDto fromEntity(MemberQualification memberQualification) {
        return MemberQualificationResponseDto.builder()
                .memberQualificationId(memberQualification.getMemberQualificationId())
                .memberId(memberQualification.getMemberQualificationId())
                .qualificationType(EnumOptionMapper.toOption(memberQualification.getQualificationType(), "qualification.type"))
                .qualificationName(memberQualification.getQualificationName())
                .qualificationNumber(memberQualification.getQualificationNumber())
                .qualificationGrade(memberQualification.getQualificationGrade())
                .issuingOrganization(memberQualification.getIssuingOrganization())
                .acquiredDate(memberQualification.getAcquiredDate())
                .suspendedDate(memberQualification.getSuspendedDate())
                .deleted(memberQualification.isDeleted())
                .active(memberQualification.isActive())
                .registerDate(memberQualification.getRegisterDate())
                .registerIp(memberQualification.getRegisterIp())
                .registerUser(memberQualification.getRegisterUser())
                .lastUpdateDate(memberQualification.getLastUpdateDate())
                .lastUpdateIp(memberQualification.getLastUpdateIp())
//                .lastUpdateId(memberQualification.getLastUpdateId())
//                .lastUpdateNm(memberQualification.getLastUpdateNm())
                .lastUpdateUser(memberQualification.getLastUpdateUser())
                .build();
    }

    public static List<MemberQualificationResponseDto> fromEntityList(List<MemberQualification> memberQualificationList) {
        return memberQualificationList.stream()
                .map(MemberQualificationResponseDto::fromEntity)
                .toList();
    }
}
