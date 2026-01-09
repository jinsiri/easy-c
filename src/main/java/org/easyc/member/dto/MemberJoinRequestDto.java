package org.easyc.member.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import org.easyc.member.constant.MemberRole;
import org.easyc.member.entity.Member;

@Getter
public class MemberJoinRequestDto {

    @NotBlank(message = "로그인 아이디가 비어있습니다.")
    private String loginId;

    @NotBlank(message = "비밀번호가 비어있습니다.")
    private String password;
    private String passwordCheck;

    @NotBlank(message = "닉네임이 비어있습니다.")
    private String nickname;

    // 비밀번호 암호화 X
    public Member toEntity() {
        return Member.builder()
                .loginId(this.loginId)
                .password(this.password)
                .memberRole(MemberRole.ROLE_USER)
                .build();
    }

    // 비밀번호 암호화
    public Member toEntity(String encodedPassword) {
        return Member.builder()
                .loginId(this.loginId)
                .password(encodedPassword)
                .memberRole(MemberRole.ROLE_USER)
                .build();
    }
}
