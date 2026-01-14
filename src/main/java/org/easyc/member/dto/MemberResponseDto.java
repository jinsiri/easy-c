package org.easyc.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.easyc.member.constant.MemberRole;
import org.easyc.member.entity.Member;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberResponseDto {
    private Long memberId;
    private String loginId;
//    private String password;
//    private String nickname;
    private MemberRole memberRole;

    @Builder
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
