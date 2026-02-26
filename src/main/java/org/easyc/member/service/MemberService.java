package org.easyc.member.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.member.dto.*;
import org.easyc.member.entity.*;
import org.easyc.member.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;


@Service
@RequiredArgsConstructor
public class MemberService {

//    private final BCryptPasswordEncoder encoder;
    private final PasswordEncoder encoder;


    private final MemberRepository memberRepository;
    private final MemberRepositoryCustom memberRepositoryCustom;
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

        Member member = memberRepository.findByDeletedFalseAndMemberId(memberId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        return MemberResponseDto.fromEntity(member);
    }

    public List<MemberLightResponseDto> getAllMembers() {
        List<MemberLightResponseDto> members = memberRepositoryCustom.findLightMembers();


        return members;
    }

    public List<MemberLightResponseDto> getPureUnassignedMembers() {
        List<MemberLightResponseDto> members = memberRepositoryCustom.findLightMembersByDeptIsNull();

        return members;
    }

    public List<MemberLightResponseDto> getMembersExcludingDept(Long excludeDeptId) {
        List<MemberLightResponseDto> members = memberRepositoryCustom.findLightMembersNotInDept(excludeDeptId);

        return members;
    }

    public MemberResponseDto getLoginUserByLoginId(String loginId) {
        if (loginId == null) return null;

        Member member = memberRepository.findByDeletedFalseAndLoginId(loginId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        return MemberResponseDto.fromEntity(member);
    }

    public MemberResponseDto getMember(Long memberId) {
        if (memberId == null) return null;

        Member member = memberRepository.findByDeletedFalseAndMemberId(memberId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

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
        optionalUser.orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        Optional<MemberProfile> optionalProfile = memberProfileRepository.findById(memberId);
        return MemberProfileResponseDto.fromEntity(optionalProfile.get());
    }

    public MemberPersonalResponseDto getMemberPersonalInfo(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        Optional<MemberPersonal> optionalPersonal = memberPersonalRepository.findById(memberId);
        return MemberPersonalResponseDto.fromEntity(optionalPersonal.get());
    }


    public List<MemberCareerResponseDto> getMemberCareers(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        List<MemberCareer> memberCareerList = memberCareerRepository.findAllByMember_memberIdAndDeletedFalse(memberId);
        return MemberCareerResponseDto.fromEntityList(memberCareerList);
    }


    public List<MemberRewardDisciplineResponseDto> getMemberRewardAndDisciplines(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        List<MemberRewardDiscipline> memberRewardDisciplines = memberRewardDisciplineRepository.findAllByMember_memberIdAndDeletedFalse(memberId);
        return MemberRewardDisciplineResponseDto.fromEntityList(memberRewardDisciplines);
    }

    public List<MemberQualificationResponseDto> getMemberQualifications(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        List<MemberQualification> memberRewardDisciplines = memberQualificationRepository.findAllByMember_memberIdAndDeletedFalse(memberId);
        return MemberQualificationResponseDto.fromEntityList(memberRewardDisciplines);
    }

    public List<MemberLanguageResponseDto> getMemberLanguages(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        List<MemberLanguage> memberLanguages = memberLanguageRepository.findAllByMember_memberIdAndDeletedFalse(memberId);
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

    @Transactional
    public void updatePassword(Long memberId, String newPassword) {
        Member member = memberRepository.findByDeletedFalseAndMemberId(memberId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));
        member.changePassword(encoder.encode(newPassword));
    }

    @Transactional
    public void updateMember(Long memberId, MemberUpdateRequestDto dto) {
        Member member = memberRepository.findByDeletedFalseAndMemberId(memberId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        member.update(dto.getMemberNm(), dto.getMemberNmEn());
        if (dto.hasNewPassword()) {
            member.changePassword(encoder.encode(dto.getPassword()));
        }

        MemberProfile profile = memberProfileRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));
        profile.update(dto.toProfileDto());

        MemberPersonal personal = memberPersonalRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));
        personal.update(dto.toPersonalDto());

        memberCareerRepository.deleteByMemberId(memberId);
        memberRewardDisciplineRepository.deleteByMemberId(memberId);
        memberQualificationRepository.deleteByMemberId(memberId);
        memberLanguageRepository.deleteByMemberId(memberId);

        dto.getCareerListOrEmpty().forEach(careerDto ->
                memberCareerRepository.save(MemberCareer.of(member, careerDto)));
        dto.getRewardDisciplineListOrEmpty().forEach(rewardDto ->
                memberRewardDisciplineRepository.save(MemberRewardDiscipline.of(member, rewardDto)));
        dto.getQualificationListOrEmpty().forEach(qualDto ->
                memberQualificationRepository.save(MemberQualification.of(member, qualDto)));
        dto.getLanguageListOrEmpty().forEach(langDto ->
                memberLanguageRepository.save(MemberLanguage.of(member, langDto)));
    }

    @Transactional
    public void delete(Long memberId) {
        Member member = memberRepository.findByDeletedFalseAndMemberId(memberId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        member.delete(); // dirty checking으로 업데이트

        memberCareerRepository.deleteByMemberId(memberId);
        memberRewardDisciplineRepository.deleteByMemberId(memberId);
        memberQualificationRepository.deleteByMemberId(memberId);
        memberLanguageRepository.deleteByMemberId(memberId);
    }

    @Transactional
    public void delete(Set<Long> memberIds) {

        List<Member> members = memberRepository.findAllByDeletedFalseAndMemberIdIn(memberIds);

        if (members.size() != memberIds.size()) {
            throw new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND);
        }

        for(Member member : members) {
            member.delete();
        }

        memberCareerRepository.deleteByMemberIds(memberIds);
        memberRewardDisciplineRepository.deleteByMemberIds(memberIds);
        memberQualificationRepository.deleteByMemberIds(memberIds);
        memberLanguageRepository.deleteByMemberIds(memberIds);
    }

}
