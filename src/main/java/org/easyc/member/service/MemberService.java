package org.easyc.member.service;

import lombok.RequiredArgsConstructor;
import org.easyc.member.dto.LoginRequestDto;
import org.easyc.member.dto.MemberJoinRequestDto;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    private final BCryptPasswordEncoder encoder;

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

    // 로그인
    public Member login(LoginRequestDto requestDto) {
        Optional<Member> optionalUser = memberRepository.findByLoginId(requestDto.getLoginId());

        // loginId와 일치하는 User가 없으면 null return
        if(optionalUser.isEmpty()) {
            return null;
        }

        Member member = optionalUser.get();

        // 찾아온 User의 password와 입력된 password가 다르면 null return
        if(!member.getPassword().equals(requestDto.getPassword())) {
            return null;
        }

        return member;
    }

    // 사용자 정보 조회
    public Member getLoginUserByUserId(Long userId) {
        if(userId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(userId);
        return optionalUser.orElse(null);
    }

    public Member getLoginUserByLoginId(String loginId) {
        if(loginId == null) return null;

        Optional<Member> optionalUser = memberRepository.findByLoginId(loginId);
        return optionalUser.orElse(null);
    }



}
