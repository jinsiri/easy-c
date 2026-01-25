package org.easyc.member.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.easyc.member.dto.*;
import org.easyc.member.entity.*;
import org.easyc.member.repository.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class MemberService {

//    private final BCryptPasswordEncoder encoder;
    private final PasswordEncoder encoder;


    private final MemberRepository memberRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final MemberPersonalRepository memberPersonalRepository;
    private final MemberCareerRepository memberCareerRepository;
    private final MemberRewardDisciplineRepository memberRewardDisciplineRepository;
    private final MemberQualificationRepository memberQualificationRepository;
    private final MemberLanguageRepository memberLanguageRepository;

    // 로그인 아이디 중복 체크
    public boolean isLoginIdDuplicate(String loginId) {
        return memberRepository.existsByLoginId(loginId);
    }

    // 회원가입 - 비밀번호 암호화
    public void join(MemberJoinRequestDto requestDto) {
        memberRepository.save(requestDto.toEntity(encoder.encode(requestDto.getPassword())));
    }

    // 사용자 정보 조회
    public MemberResponseDto getLoginUserByMemberId(Long memberId) {
        if(memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
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

    public MemberResponseDto getMember(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        Member member = optionalUser
                .orElseThrow(() -> new UsernameNotFoundException("Member not found"));

        MemberResponseDto memberDto = MemberResponseDto.fromEntity(member);

        Optional<MemberProfile> optionalProfile = memberProfileRepository.findById(memberId);
        optionalProfile.ifPresent(memberProfile -> memberDto.setMemberProfile(MemberProfileResponseDto.fromEntity(memberProfile)));

        Optional<MemberPersonal> optionalPersonal = memberPersonalRepository.findById(memberId);
        optionalPersonal.ifPresent(personal -> memberDto.setMemberPersonal(MemberPersonalResponseDto.fromEntity(personal)));

        return memberDto;
    }

    public MemberProfileResponseDto getMemberBasicInfo(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new UsernameNotFoundException("Member not found"));

        Optional<MemberProfile> optionalProfile = memberProfileRepository.findById(memberId);
        return MemberProfileResponseDto.fromEntity(optionalProfile.get());
    }

    public MemberPersonalResponseDto getMemberPersonalInfo(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new UsernameNotFoundException("Member not found"));

        Optional<MemberPersonal> optionalPersonal = memberPersonalRepository.findById(memberId);
        return MemberPersonalResponseDto.fromEntity(optionalPersonal.get());
    }


    public List<MemberCareerResponseDto> getMemberCareers(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new UsernameNotFoundException("Member not found"));

        List<MemberCareer> memberCareerList = memberCareerRepository.findAllByMember_memberId(memberId);
        return MemberCareerResponseDto.fromEntityList(memberCareerList);
    }


    public List<MemberRewardDisciplineResponseDto> getMemberRewardAndDisciplines(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new UsernameNotFoundException("Member not found"));

        List<MemberRewardDiscipline> memberRewardDisciplines = memberRewardDisciplineRepository.findAllByMember_memberId(memberId);
        return MemberRewardDisciplineResponseDto.fromEntityList(memberRewardDisciplines);
    }

    public List<MemberQualificationResponseDto> getMemberQualifications(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new UsernameNotFoundException("Member not found"));

        List<MemberQualification> memberRewardDisciplines = memberQualificationRepository.findAllByMember_memberId(memberId);
        return MemberQualificationResponseDto.fromEntityList(memberRewardDisciplines);
    }

    public List<MemberLanguageResponseDto> getMemberLanguages(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new UsernameNotFoundException("Member not found"));

        List<MemberLanguage> memberLanguages = memberLanguageRepository.findAllByMember_memberId(memberId);
        return MemberLanguageResponseDto.fromEntityList(memberLanguages);
    }

    @Transactional
    public void createMember(MemberJoinRequestDto requestDto,
                             MemberProfileRequestDto profileRequestDto,
                             MemberPersonalRequestDto personalRequestDto,
                             List<MemberCareerRequestDto> careerDtos,
                             List<MemberRewardDisciplineRequestDto> rewardDisciplineDtos,
                             List<MemberQualificationRequestDto> qualificationDtos,
                             List<MemberLanguageRequestDto> languageDtos
    ) {
        Member member = memberRepository.save(
                requestDto.toEntity(
                        encoder.encode(requestDto.getPassword())
                )
        );

        MemberProfile profile = MemberProfile.of(member, profileRequestDto);
        memberProfileRepository.save(profile);

        MemberPersonal personal = MemberPersonal.of(member, personalRequestDto);
        memberPersonalRepository.save(personal);


        careerDtos.forEach(dto ->
                memberCareerRepository.save(MemberCareer.of(member, dto))
        );

        rewardDisciplineDtos.forEach(dto ->
                memberRewardDisciplineRepository.save(MemberRewardDiscipline.of(member, dto))
        );

        qualificationDtos.forEach(dto ->
                memberQualificationRepository.save(MemberQualification.of(member, dto))
        );

        languageDtos.forEach(dto ->
                memberLanguageRepository.save(MemberLanguage.of(member, dto))
        );

    }

}