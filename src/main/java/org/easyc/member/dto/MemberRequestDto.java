package org.easyc.member.dto;

import lombok.Getter;
import org.easyc.member.constant.AccountStatus;
import org.easyc.member.constant.MemberRole;
import org.easyc.member.entity.Member;

@Getter
public class MemberRequestDto {
    private Long memberId;
    private String loginId;
    private String memberNm;
    private String memberNmEn; // 영문 이름
    private MemberRole memberRole;
    private AccountStatus accountStatus;

    public Member toEntity() {
        return Member.builder()
                .memberId(memberId)
                .loginId(loginId)
                .memberNm(memberNm)
                .memberNmEn(memberNmEn)
                .memberRole(memberRole)
                .accountStatus(accountStatus)
                .build();
    }
}
