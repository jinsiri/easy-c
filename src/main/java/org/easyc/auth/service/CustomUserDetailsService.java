package org.easyc.auth.service;

import lombok.RequiredArgsConstructor;
import org.easyc.auth.dto.CustomUserDetails;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String loginId)
            throws UsernameNotFoundException {

        Member member = memberRepository.findByDeletedFalseAndLoginId(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("Member not found: " + loginId));

        return new CustomUserDetails(member);
    }

    /*@Override
    public UserDetails loadUserByUsername(String loginId)
            throws UsernameNotFoundException {

        Member member = memberRepository.findByDeletedFalseAndLoginId(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("Member not found: " + loginId));

        return org.springframework.security.core.userdetails.User
                .withUsername(member.getLoginId())
                .password(member.getPassword())
                .authorities(member.getMemberRole().name())
                .build();
    }*/
}
