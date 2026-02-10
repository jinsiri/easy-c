package org.easyc.auth.dto;

import lombok.Getter;
import org.easyc.common.dto.AuditUser;
import org.easyc.member.entity.Member;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserDetails implements UserDetails {

    private final String loginId;
    private final String password;
    private final String memberNm;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(Member member) {
        this.loginId = member.getLoginId();
        this.password = member.getPassword();
        this.memberNm = member.getMemberNm();
        this.authorities =
                List.of(new SimpleGrantedAuthority(member.getMemberRole().name()));
    }
    public CustomUserDetails(AuditUser dto) {
        this.loginId = dto.getLoginId();
        this.password = null;
        this.memberNm = dto.getMemberNm();
        this.authorities =
                List.of(new SimpleGrantedAuthority(dto.getMemberRole()));
    }

    @Override
    public String getUsername() {
        return loginId;
    }
}