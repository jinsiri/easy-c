package org.easyc.member.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.member.entity.MemberCareer;

import java.time.LocalDate;
import java.util.List;

@Getter
@SuperBuilder
public class MemberCareerResponseDto extends BaseDto {
    private Long memberCareerId;

    private Long memberId;

    // 시작일
    private LocalDate startDate;
    // 종료일
    private LocalDate endDate;

    // 근무처
    private String companyName;

    // 직위
    private String positionTitle;

    // 담당업무
    private String jobDescription;

    // 근무기간
    private String workPeriod; // todo 예: 6개월 등.. 필요없는 경우 삭제

    // 퇴직사유
    private String resignationReason;


    public static MemberCareerResponseDto fromEntity(MemberCareer memberCareer) {
        return MemberCareerResponseDto.builder()
                .memberCareerId(memberCareer.getMemberCareerId())
                .memberId(memberCareer.getMember().getMemberId())
                .companyName(memberCareer.getCompanyName())
                .positionTitle(memberCareer.getPositionTitle())
                .startDate(memberCareer.getStartDate())
                .endDate(memberCareer.getEndDate())
                .workPeriod(memberCareer.getWorkPeriod())
                .resignationReason(memberCareer.getResignationReason())
                .deleted(memberCareer.isDeleted())
                .active(memberCareer.isActive())
                .registerDate(memberCareer.getRegisterDate())
                .registerIp(memberCareer.getRegisterIp())
                .registerUser(memberCareer.getRegisterUser())
                .lastUpdateDate(memberCareer.getLastUpdateDate())
                .lastUpdateIp(memberCareer.getLastUpdateIp())
//                .lastUpdateId(memberCareer.getLastUpdateId())
//                .lastUpdateNm(memberCareer.getLastUpdateNm())
                .lastUpdateUser(memberCareer.getLastUpdateUser())
                .build();
    }

    public static List<MemberCareerResponseDto> fromEntityList(List<MemberCareer> memberCareers) {
        return memberCareers.stream()
                .map(MemberCareerResponseDto::fromEntity)
                .toList();
    }
}
