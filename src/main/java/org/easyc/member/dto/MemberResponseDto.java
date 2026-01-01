package org.easyc.member.dto;

import lombok.Builder;
import org.easyc.common.constant.MemberRole;
import org.easyc.member.entity.Member;

@Builder
public class MemberResponseDto {
    private Long memberId;
    private String loginId;
//    private String password;
//    private String nickname;
    private MemberRole memberRole;

    public static MemberResponseDto fromEntity(Member member) {
        return MemberResponseDto.builder()
                .memberId(member.getMemberId())
                .loginId(member.getLoginId())
//                .password(member.getPassword()) //암호화
//                .nickname(member.getNickname())
                .memberRole(member.getMemberRole())
                .build();
    }
}
