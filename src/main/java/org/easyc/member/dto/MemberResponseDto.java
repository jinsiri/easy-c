package org.easyc.member.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.member.constant.AccountStatus;
import org.easyc.member.constant.MemberRole;
import org.easyc.member.entity.Member;
import org.easyc.memberJobGradeMap.dto.MemberJobGradeMapResponseDto;
import org.easyc.memberJobPositionMap.dto.MemberJobPositionMapResponseDto;
import org.easyc.memberJobRoleMap.dto.MemberJobRoleMapResponseDto;

import java.util.List;

@Getter
@Setter
@SuperBuilder
public class MemberResponseDto extends BaseDto {
    private Long memberId;
    private String loginId;
    private String memberNm;
    private String memberNmEn; // 영문 이름
    private MemberRole memberRole;
    private AccountStatus accountStatus;
    private String profileImagePath;

    private MemberJobPositionMapResponseDto jobPosition;
    private MemberJobGradeMapResponseDto jobGrade;
    private MemberJobRoleMapResponseDto jobRole;

    @JsonUnwrapped // 중첩 해제
    private MemberProfileResponseDto memberProfile;

    @JsonUnwrapped
    private MemberPersonalResponseDto memberPersonal;

    private List<MemberCareerResponseDto> memberCareers;


    public static MemberResponseDto fromEntity(Member member) {
        return MemberResponseDto.builder()
                .memberId(member.getMemberId())
                .loginId(member.getLoginId())
                .memberNm(member.getMemberNm())
                .memberNmEn(member.getMemberNmEn())
                .memberRole(member.getMemberRole())
                .accountStatus(member.getAccountStatus())
                .deleted(member.isDeleted())
                .active(member.isActive())
                .registerDate(member.getRegisterDate())
                .registerIp(member.getRegisterIp())
                .registerUser(member.getRegisterUser())
                .lastUpdateDate(member.getLastUpdateDate())
                .lastUpdateIp(member.getLastUpdateIp())
                .lastUpdateUser(member.getLastUpdateUser())
//                .lastUpdateId(member.getLastUpdateId())
//                .lastUpdateNm(member.getLastUpdateNm())
                .build();
    }

    public static List<MemberResponseDto> fromEntityList(List<Member> members) {
        return members.stream()
                .map(MemberResponseDto::fromEntity)
                .toList();
    }
}
