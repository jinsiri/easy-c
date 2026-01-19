package org.easyc.member.service;

import lombok.RequiredArgsConstructor;
import org.easyc.member.dto.MemberJoinRequestDto;
import org.easyc.member.dto.MemberResponseDto;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

//    private final BCryptPasswordEncoder encoder;
    private final PasswordEncoder encoder;

    // 로그인 아이디 중복 체크
    public boolean isLoginIdDuplicate(String loginId) {
        return memberRepository.existsByLoginId(loginId);
    }

    // 닉네임 중복 체크
    public boolean isNicknameDuplicate(String loginId) {
        return memberRepository.existsByNickname(loginId);
    }

    // 회원가입 - 비밀번호 암호화
    public void join(MemberJoinRequestDto requestDto) {
        memberRepository.save(requestDto.toEntity(encoder.encode(requestDto.getPassword())));
    }

    // 사용자 정보 조회
    public MemberResponseDto getLoginUserByUserId(Long userId) {
        if(userId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(userId);
        Member member = optionalUser
                .orElseThrow(() -> new UsernameNotFoundException("Member not found"));

        return MemberResponseDto.fromEntity(member);
    }

    public MemberResponseDto getLoginUserByLoginId(String loginId) {
        if (loginId == null) return null;

        Optional<Member> optionalUser = memberRepository.findByLoginId(loginId);
        Member member = optionalUser
                .orElseThrow(() -> new UsernameNotFoundException("Member not found"));

        return MemberResponseDto.fromEntity(member);
    }
}