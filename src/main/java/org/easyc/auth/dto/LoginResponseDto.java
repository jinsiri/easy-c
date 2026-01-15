package org.easyc.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.easyc.member.constant.MemberRole;
import org.easyc.member.entity.Member;

@Getter
@NoArgsConstructor
public class LoginResponseDto {
    private Long memberId;
    private String loginId;
    private MemberRole memberRole;

    public LoginResponseDto(Member entity) {
        this.memberId = entity.getMemberId();
        this.loginId = entity.getLoginId();
        this.memberRole = entity.getMemberRole();
    }
}
