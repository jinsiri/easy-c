package org.easyc.member.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.common.dto.BulkDeleteRequestDto;
import org.easyc.member.dto.*;
import org.easyc.member.service.MemberService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
     * 전체 멤버 조회
     *
     * @return 모든 멤버의 간략 정보 리스트
     *         (MemberLightResponseDto)
     *         TODO: 부서 정보, 직위/직무 등 추가 필요
     * @return
     */
    @GetMapping
    public List<MemberLightResponseDto> getAllMembers() {
        return memberService.getAllMembers();
    }
    
    /**
     * 인사정보 조회 - 기본 인사정보

     * @param memberId 조회할 멤버 ID
     * @return 해당 멤버의 기본 인사 정보 (MemberResponseDto)
     *         TODO: 부서 정보, 직위/직무 등 추가 필요
     */
    @GetMapping("/{memberId}")
    public MemberResponseDto getMember(@PathVariable Long memberId) {
        return memberService.getMember(memberId);
    }

    /**
     * 인사정보 조회 - 기본정보 탭

     * @param memberId 조회할 멤버 ID
     * @return 멤버의 기본 정보 (MemberProfileResponseDto)
     */
    @GetMapping("/{memberId}/basic")
    public MemberProfileResponseDto getMemberBasicInfo(@PathVariable Long memberId) {
        return memberService.getMemberBasicInfo(memberId);
    }

    /**
     * 인사정보 조회 - 신상정보 탭

     * @param memberId 조회할 멤버 ID
     * @return 멤버의 신상 정보 (MemberPersonalResponseDto)
     */
    @GetMapping("/{memberId}/personal")
    public MemberPersonalResponseDto getMemberPersonalInfo(@PathVariable Long memberId) {
        return memberService.getMemberPersonalInfo(memberId);
    }


    /**
     * 인사정보 조회 - 경력 탭

     * @param memberId 조회할 멤버 ID
     * @return 멤버의 경력 정보 리스트 (MemberCareerResponseDto)
     */
    @GetMapping("/{memberId}/career")
    public List<MemberCareerResponseDto> getMemberCareerInfo(@PathVariable Long memberId) {
        return memberService.getMemberCareers(memberId);
    }

    /**
     * 인사정보 조회 - 포상/징계 탭

     * @param memberId 조회할 멤버 ID
     * @return 멤버의 포상/징계 정보 리스트 (MemberRewardDisciplineResponseDto)
     */
    @GetMapping("/{memberId}/reward-discipline")
    public List<MemberRewardDisciplineResponseDto> getMemberRewardDisciplineInfo(@PathVariable Long memberId) {
        return memberService.getMemberRewardAndDisciplines(memberId);
    }

    /**
     * 인사정보 조회 - 자격 탭
     *
     * @param memberId 조회할 멤버 ID
     * @return 멤버의 자격 정보 리스트 (MemberQualificationResponseDto)
     */
    @GetMapping("/{memberId}/qualification")
    public List<MemberQualificationResponseDto> getMemberQualificationInfo(
            @PathVariable Long memberId) {
        return memberService.getMemberQualifications(memberId);
    }

    /**
     * 인사정보 조회 - 어학 탭
     *
     * @param memberId 조회할 멤버 ID
     * @return 멤버의 어학 정보 리스트 (MemberLanguageResponseDto)
     */
    @GetMapping("/{memberId}/languages")
    public List<MemberLanguageResponseDto> getMemberLanguageInfo(
            @PathVariable Long memberId) {
        return memberService.getMemberLanguages(memberId);
    }

    /**
     * 멤버 등록
     */
    @PostMapping
    public void createMember(@RequestBody MemberCreateRequestDto dto) {
        memberService.createMember(
                dto.toJoinDto(),
                dto.toProfileDto(),
                dto.toPersonalDto(),
                dto.getCareerListOrEmpty(),
                dto.getRewardDisciplineListOrEmpty(),
                dto.getQualificationListOrEmpty(),
                dto.getLanguageListOrEmpty()
        );
    }

    /**
     * 멤버 삭제 - 단일
     *
     * @param memberId 삭제할 멤버 ID
     */
    @DeleteMapping("/{memberId}")
    public void deleteMember(@PathVariable Long memberId) {
        memberService.delete(memberId);
    }

    /**
     * 멤버 삭제 - 다중
     *
     * @param requestDto 삭제할 멤버 ID 리스트를 담은 DTO
     */
    @DeleteMapping
    public void deleteMembers(@RequestBody BulkDeleteRequestDto requestDto) {
        memberService.delete(requestDto.getIds());
    }

}
