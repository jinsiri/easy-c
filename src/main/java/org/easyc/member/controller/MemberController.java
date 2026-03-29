package org.easyc.member.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.audit.activity.annotation.AuditAction;
import org.easyc.common.dto.BulkDeleteRequestDto;
import org.easyc.deptMemberMap.dto.DeptMemberMapResponseDto;
import org.easyc.deptMemberMap.service.DeptMemberMapService;
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
    private final DeptMemberMapService deptMemberMapService;

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
     */
    @GetMapping
    public List<MemberLightResponseDto> getAllMembers(
            @RequestParam(required = false) Boolean unassigned,
            @RequestParam(name = "exclude-deptId", required = false) Long excludeDeptId,
            @RequestParam(name = "target-deptId", required = false) Long targetDeptId
    ) {
        // 1. 아예 미배정인 경우 (?unassigned=true)
        if (Boolean.TRUE.equals(unassigned)) {
            return memberService.getPureUnassignedMembers();
        }

        // 2. 특정 부서 기준 미배정인 경우 (?exclude-deptId=)
        if (excludeDeptId != null) {
            return memberService.getMembersExcludingDept(excludeDeptId);
        }

        // 3. 특정 부서의 부서원만 조회할 경우(?target-deptId=)
        if(targetDeptId != null) {
             return memberService.getMembersByDept(targetDeptId);
        }

        // 4. 조건 없으면 전체 조회
        return memberService.getAllMembers();
    }
    
    /**
     * 인사정보 조회 - 기본 인사정보

     * @param memberId 조회할 멤버 ID
     * @return 해당 멤버의 기본 인사 정보 (MemberResponseDto)
     *
     */
    @GetMapping("/{memberId}")
    public MemberResponseDto getMember(@PathVariable Long memberId) {
        return memberService.getMember(memberId);
    }

    /**
     * 인사정보 조회 - 멤버 부서 정보

     * @param memberId 조회할 멤버 ID
     * @return 멤버의 부서 정보 리스트 (DeptMemberMapResponseDto)
     */
    @GetMapping("/{memberId}/depts")
    public List<DeptMemberMapResponseDto> getDeptMemberMapInfo(@PathVariable Long memberId) {
        return deptMemberMapService.findByMemberId(memberId);
    }

    /**
     * 인사정보 조회 - 멤버 부서 정보

     * @param memberId 조회할 멤버 ID
     * @return 멤버의 부서 정보 리스트 (DeptMemberMapResponseDto)
     */
    @GetMapping("/{memberId}/depts/primary")
    public DeptMemberMapResponseDto findByMemberIdPrimary(@PathVariable Long memberId) {
        return deptMemberMapService.findByMemberIdPrimary(memberId);
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
    @GetMapping("/{memberId}/careers")
    public List<MemberCareerResponseDto> getMemberCareerInfo(@PathVariable Long memberId) {
        return memberService.getMemberCareers(memberId);
    }

    /**
     * 인사정보 조회 - 포상/징계 탭

     * @param memberId 조회할 멤버 ID
     * @return 멤버의 포상/징계 정보 리스트 (MemberRewardDisciplineResponseDto)
     */
    @GetMapping("/{memberId}/reward-disciplines")
    public List<MemberRewardDisciplineResponseDto> getMemberRewardDisciplineInfo(@PathVariable Long memberId) {
        return memberService.getMemberRewardAndDisciplines(memberId);
    }

    /**
     * 인사정보 조회 - 자격 탭
     *
     * @param memberId 조회할 멤버 ID
     * @return 멤버의 자격 정보 리스트 (MemberQualificationResponseDto)
     */
    @GetMapping("/{memberId}/qualifications")
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
    @AuditAction(code = "MEMBER_CREATE", name = "회원 등록", targetType = "MEMBER")
    @PostMapping
    public void createMember(@RequestBody MemberCreateRequestDto dto) {
        memberService.createMember(
                dto.toJoinDto(),
                dto.toOrgSettingDto(),
                dto.toProfileDto(),
                dto.toPersonalDto(),
                dto.getCareerListOrEmpty(),
                dto.getRewardDisciplineListOrEmpty(),
                dto.getQualificationListOrEmpty(),
                dto.getLanguageListOrEmpty()
        );
    }

    /**
     * 멤버 수정
     *
     * @param memberId 수정할 멤버 ID
     * @param dto      수정 데이터
     */
    @AuditAction(code = "MEMBER_UPDATE", name = "회원 수정", targetType = "MEMBER")
    @PutMapping("/{memberId}")
    public void updateMember(@PathVariable Long memberId, @RequestBody MemberUpdateRequestDto dto) {
        memberService.updateMember(memberId, dto);
    }

    /**
     * 비밀번호 변경
     *
     * @param memberId 변경할 멤버 ID
     * @param dto      새 비밀번호
     */
    @AuditAction(code = "MEMBER_PASSWORD_CHANGE", name = "비밀번호 변경", targetType = "MEMBER")
    @PutMapping("/{memberId}/password")
    public void updatePassword(@PathVariable Long memberId, @RequestBody MemberPasswordUpdateRequestDto dto) {
        memberService.updatePassword(memberId, dto.getPassword());
    }

    /**
     * 멤버 삭제 - 단일
     *
     * @param memberId 삭제할 멤버 ID
     */
    @AuditAction(code = "MEMBER_DELETE", name = "회원 삭제", targetType = "MEMBER")
    @DeleteMapping("/{memberId}")
    public void deleteMember(@PathVariable Long memberId) {
        memberService.delete(memberId);
    }

    /**
     * 멤버 삭제 - 다중
     *
     * @param requestDto 삭제할 멤버 ID 리스트를 담은 DTO
     */
    @AuditAction(code = "MEMBER_BULK_DELETE", name = "회원 일괄 삭제", targetType = "MEMBER")
    @DeleteMapping
    public void deleteMembers(@RequestBody BulkDeleteRequestDto requestDto) {
        memberService.delete(requestDto.getIds());
    }

}
