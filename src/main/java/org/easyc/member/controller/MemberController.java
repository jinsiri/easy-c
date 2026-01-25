package org.easyc.member.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.member.dto.*;
import org.easyc.member.service.MemberService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    // 테스트용으로 사용
    @GetMapping("/me")
    public MemberResponseDto getCurrentMember(Authentication authentication) {
        String loginId = authentication.getName();
        return memberService.getLoginUserByLoginId(loginId);
    }

    /**
     * 인사정보 조회 - 기본 인사정보
     * @param memberId
     * @return
     */
    @GetMapping("/{memberId}")
    public MemberResponseDto getMember(@PathVariable Long memberId) {
        return memberService.getMember(memberId);
        //todo 부서정보, 직위직무 등 필요
    }

    /**
     * 인사정보 조회 - 기본정보 탭
     * @param memberId
     * @return
     */
    @GetMapping("/{memberId}/basic")
    public MemberProfileResponseDto getMemberBasicInfo(@PathVariable Long memberId) {
        return memberService.getMemberBasicInfo(memberId);
    }

    /**
     * 인사정보 조회 - 신상정보 탭
     * @param memberId
     * @return
     */
    @GetMapping("/{memberId}/personal")
    public MemberPersonalResponseDto getMemberPersonalInfo(@PathVariable Long memberId) {
        return memberService.getMemberPersonalInfo(memberId);
    }


    /**
     * 인사정보 조회 - 경력 탭
     * @param memberId
     * @return
     */
    @GetMapping("/{memberId}/career")
    public List<MemberCareerResponseDto> getMemberCareerInfo(@PathVariable Long memberId) {
        return memberService.getMemberCareers(memberId);
    }

    /**
     * 인사정보 조회 - 포상/징계 탭
     * @param memberId
     * @return
     */
    @GetMapping("/{memberId}/reward-discipline")
    public List<MemberRewardDisciplineResponseDto> getMemberRewardDisciplineInfo(@PathVariable Long memberId) {
        return memberService.getMemberRewardAndDisciplines(memberId);
    }

    /**
     * 인사정보 조회 - 자격 탭
     */
    @GetMapping("/{memberId}/qualification")
    public List<MemberQualificationResponseDto> getMemberQualificationInfo(
            @PathVariable Long memberId) {
        return memberService.getMemberQualifications(memberId);
    }

    /**
     * 인사정보 조회 - 어학 탭
     */
    @GetMapping("/{memberId}/languages")
    public List<MemberLanguageResponseDto> getMemberLanguageInfo(
            @PathVariable Long memberId) {
        return memberService.getMemberLanguages(memberId);
    }

}
