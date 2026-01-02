package org.easyc.member.dto;

import lombok.Getter;
import org.easyc.common.constant.MemberRole;
import org.easyc.member.entity.Member;

@Getter
public class MemberRequestDto {

    private Long memberId;
    private String loginId;
    private String password;
//    private String nickname;
    private MemberRole memberRole;

    public Member toEntity(MemberRequestDto memberRequestDto) {
        return Member.builder()
                .memberId(memberRequestDto.getMemberId())
                .loginId(memberRequestDto.getLoginId())
                .password(memberRequestDto.getPassword()) //암호화
//                .nickname(memberRequestDto.getNickname())
                .memberRole(memberRequestDto.getMemberRole())
                .build();
    }
}
