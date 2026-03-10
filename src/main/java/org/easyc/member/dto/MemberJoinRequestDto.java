package org.easyc.member.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import org.easyc.deptMemberMap.dto.DeptMemberMapRequestDto;
import org.easyc.member.constant.AccountStatus;
import org.easyc.member.constant.MemberRole;
import org.easyc.member.entity.Member;

import java.util.List;

@Getter
public class MemberJoinRequestDto { //회원가입 등 비밀번호 필요할 때 사용

    @NotBlank(message = "로그인 아이디가 비어있습니다.")
    private String loginId;

    @NotBlank(message = "비밀번호가 비어있습니다.")
    private String password;
    private String passwordCheck;

    private String memberNm;
    private String memberNmEn; // 영문 이름
    private MemberRole memberRole;
    private AccountStatus accountStatus;

    // ── 조직 관련 ──
    private Long jobPositionId;
    private Long jobGradeId;
    private Long jobRoleId;
    private List<DeptMemberMapRequestDto> deptMemberMapDto;

    public MemberJoinRequestDto(String loginId, String password, String memberNm, String memberNmEn, MemberRole memberRole) {
        this.loginId = loginId;
        this.password = password;
        this.memberNm = memberNm;
        this.memberNmEn = memberNmEn;
        this.memberRole = memberRole;
        this.accountStatus = AccountStatus.ACTIVE;
    }

    // 비밀번호 암호화 X
    public Member toEntity() {
        return Member.builder()
                .loginId(this.loginId)
                .password(this.password)
                .memberNm(this.memberNm)
                .memberNmEn(this.memberNmEn)
                .memberRole(this.memberRole)
                .accountStatus(this.accountStatus)
                .build();
    }

    // 비밀번호 암호화
    public Member toEntity(String encodedPassword) {
        return Member.builder()
                .loginId(this.loginId)
                .password(encodedPassword)
                .memberNm(this.memberNm)
                .memberNmEn(this.memberNmEn)
                .memberRole(this.memberRole)
                .accountStatus(this.accountStatus)
                .build();
    }
}
