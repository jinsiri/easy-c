package org.easyc.member.repository;

import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.member.dto.MemberLightResponseDto;
import org.easyc.member.dto.QMemberLightResponseDto;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.easyc.dept.entity.QDept.dept;
import static org.easyc.deptMemberMap.entity.QDeptMemberMap.deptMemberMap;
import static org.easyc.jobPosition.entity.QJobPosition.jobPosition;
import static org.easyc.jobTitle.entity.QJobTitle.jobTitle;
import static org.easyc.member.entity.QMember.member;
import static org.easyc.member.entity.QMemberPersonal.memberPersonal;
import static org.easyc.member.entity.QMemberProfile.memberProfile;
import static org.easyc.memberJobPositionMap.entity.QMemberJobPositionMap.memberJobPositionMap;
import static org.easyc.memberJobTitleMap.entity.QMemberJobTitleMap.memberJobTitleMap;

@RequiredArgsConstructor
@Repository
public class MemberRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public List<MemberLightResponseDto> findLightMembers() {
        List<MemberLightResponseDto> flatResults = queryFactory
                .select(new QMemberLightResponseDto(
                        member.memberId,
                        member.memberNm,
                        member.loginId,
                        member.memberRole,
                        member.accountStatus,
                        memberProfile.employeeId,
                        memberProfile.email,
                        memberProfile.employmentType,
                        memberProfile.employmentStatus,
                        memberPersonal.phoneNumber,
                        dept.deptNm,
                        jobTitle.jobTitleNm,
                        jobPosition.jobPositionNm,
                        member.deleted,
                        member.active,
                        member.registerDate,
                        member.registerIp,
                        member.registerUser,
                        member.lastUpdateDate,
                        member.lastUpdateIp,
                        member.lastUpdateUser
                ))
                .from(member)
                .leftJoin(memberProfile).on(member.memberId.eq(memberProfile.memberId))
                .leftJoin(memberPersonal).on(member.memberId.eq(memberPersonal.memberId))
                .leftJoin(deptMemberMap).on(member.memberId.eq(deptMemberMap.memberId), deptMemberMap.deleted.isFalse())
                .leftJoin(dept).on(deptMemberMap.deptId.eq(dept.deptId))
                .leftJoin(memberJobTitleMap).on(member.memberId.eq(memberJobTitleMap.memberId), memberJobTitleMap.deleted.isFalse())
                .leftJoin(jobTitle).on(memberJobTitleMap.jobTitleId.eq(jobTitle.jobTitleId))
                .leftJoin(memberJobPositionMap).on(member.memberId.eq(memberJobPositionMap.memberId), memberJobPositionMap.deleted.isFalse())
                .leftJoin(jobPosition).on(memberJobPositionMap.jobPositionId.eq(jobPosition.jobPositionId))
                .where(member.deleted.isFalse())
                .fetch();

        Map<Long, MemberLightResponseDto> map = new LinkedHashMap<>();
        for (MemberLightResponseDto dto : flatResults) {
            MemberLightResponseDto mainDto = map.computeIfAbsent(dto.getMemberId(), id -> dto);

            if (mainDto != dto) {
                mainDto.addDeptInfo(dto.getDeptNm(), dto.getJobTitle());
            }
        }

        List<MemberLightResponseDto> result = new ArrayList<>(map.values());
        result.forEach(MemberLightResponseDto::finalizeDisplayInfo);

        return result;
    }

    public List<MemberLightResponseDto> findLightMembersByDeptIsNull() {
        List<MemberLightResponseDto> flatResults = queryFactory
                .select(new QMemberLightResponseDto(
                        member.memberId,
                        member.memberNm,
                        member.loginId,
                        member.memberRole,
                        member.accountStatus,
                        memberProfile.employeeId,
                        memberProfile.email,
                        memberProfile.employmentType,
                        memberProfile.employmentStatus,
                        memberPersonal.phoneNumber,
                        dept.deptNm,
                        jobTitle.jobTitleNm,
                        jobPosition.jobPositionNm,
                        member.deleted,
                        member.active,
                        member.registerDate,
                        member.registerIp,
                        member.registerUser,
                        member.lastUpdateDate,
                        member.lastUpdateIp,
                        member.lastUpdateUser
                ))
                .from(member)
                .leftJoin(memberProfile).on(member.memberId.eq(memberProfile.memberId))
                .leftJoin(memberPersonal).on(member.memberId.eq(memberPersonal.memberId))
                .leftJoin(deptMemberMap).on(member.memberId.eq(deptMemberMap.memberId), deptMemberMap.deleted.isFalse())
                .leftJoin(dept).on(deptMemberMap.deptId.eq(dept.deptId))
                .leftJoin(memberJobTitleMap).on(member.memberId.eq(memberJobTitleMap.memberId), memberJobTitleMap.deleted.isFalse())
                .leftJoin(jobTitle).on(memberJobTitleMap.jobTitleId.eq(jobTitle.jobTitleId))
                .leftJoin(memberJobPositionMap).on(member.memberId.eq(memberJobPositionMap.memberId), memberJobPositionMap.deleted.isFalse())
                .leftJoin(jobPosition).on(memberJobPositionMap.jobPositionId.eq(jobPosition.jobPositionId))
                .where(
                        member.deleted.isFalse(),
                        deptMemberMap.memberId.isNull()
                )
                .fetch();

        Map<Long, MemberLightResponseDto> map = new LinkedHashMap<>();
        for (MemberLightResponseDto dto : flatResults) {
            MemberLightResponseDto mainDto = map.computeIfAbsent(dto.getMemberId(), id -> dto);

            if (mainDto != dto) {
                mainDto.addDeptInfo(dto.getDeptNm(), dto.getJobTitle());
            }
        }

        return new ArrayList<>(map.values());
    }

    public List<MemberLightResponseDto> findLightMembersNotInDept(Long targetDeptId) {
        JPQLQuery<Long> memberIdsInDept = JPAExpressions
                .select(deptMemberMap.memberId)
                .from(deptMemberMap)
                .where(
                        deptMemberMap.deptId.eq(targetDeptId),
                        deptMemberMap.deleted.isFalse()
                );

        List<MemberLightResponseDto> flatResults = queryFactory
                .select(new QMemberLightResponseDto(
                        member.memberId,
                        member.memberNm,
                        member.loginId,
                        member.memberRole,
                        member.accountStatus,
                        memberProfile.employeeId,
                        memberProfile.email,
                        memberProfile.employmentType,
                        memberProfile.employmentStatus,
                        memberPersonal.phoneNumber,
                        dept.deptNm,
                        jobTitle.jobTitleNm,
                        jobPosition.jobPositionNm,
                        member.deleted,
                        member.active,
                        member.registerDate,
                        member.registerIp,
                        member.registerUser,
                        member.lastUpdateDate,
                        member.lastUpdateIp,
                        member.lastUpdateUser
                ))
                .from(member)
                .leftJoin(memberProfile).on(member.memberId.eq(memberProfile.memberId))
                .leftJoin(memberPersonal).on(member.memberId.eq(memberPersonal.memberId))
                .leftJoin(deptMemberMap).on(member.memberId.eq(deptMemberMap.memberId), deptMemberMap.deleted.isFalse())
                .leftJoin(dept).on(deptMemberMap.deptId.eq(dept.deptId))
                .leftJoin(memberJobTitleMap).on(member.memberId.eq(memberJobTitleMap.memberId), memberJobTitleMap.deleted.isFalse())
                .leftJoin(jobTitle).on(memberJobTitleMap.jobTitleId.eq(jobTitle.jobTitleId))
                .leftJoin(memberJobPositionMap).on(member.memberId.eq(memberJobPositionMap.memberId), memberJobPositionMap.deleted.isFalse())
                .leftJoin(jobPosition).on(memberJobPositionMap.jobPositionId.eq(jobPosition.jobPositionId))
                .where(
                        member.deleted.isFalse(),
                        member.memberId.notIn(memberIdsInDept)
                )
                .fetch();

        Map<Long, MemberLightResponseDto> map = new LinkedHashMap<>();
        for (MemberLightResponseDto dto : flatResults) {
            MemberLightResponseDto mainDto = map.computeIfAbsent(dto.getMemberId(), id -> dto);

            if (mainDto != dto) {
                mainDto.addDeptInfo(dto.getDeptNm(), dto.getJobTitle());
            }
        }


        return new ArrayList<>(map.values());
    }

    public List<MemberLightResponseDto> findLightMembersByDeptId(Long targetDeptId) {
        List<MemberLightResponseDto> flatResults = queryFactory
                .select(new QMemberLightResponseDto(
                        member.memberId,
                        member.memberNm,
                        member.loginId,
                        member.memberRole,
                        member.accountStatus,
                        memberProfile.employeeId,
                        memberProfile.email,
                        memberProfile.employmentType,
                        memberProfile.employmentStatus,
                        memberPersonal.phoneNumber,
                        dept.deptNm,
                        jobTitle.jobTitleNm,
                        jobPosition.jobPositionNm,
                        member.deleted,
                        member.active,
                        member.registerDate,
                        member.registerIp,
                        member.registerUser,
                        member.lastUpdateDate,
                        member.lastUpdateIp,
                        member.lastUpdateUser
                ))
                .from(member)
                .leftJoin(memberProfile).on(member.memberId.eq(memberProfile.memberId))
                .leftJoin(memberPersonal).on(member.memberId.eq(memberPersonal.memberId))
                // 부서 매핑 조인
                .leftJoin(deptMemberMap).on(member.memberId.eq(deptMemberMap.memberId), deptMemberMap.deleted.isFalse())
                .leftJoin(dept).on(deptMemberMap.deptId.eq(dept.deptId))
                // 기타 직급/직책 조인
                .leftJoin(memberJobTitleMap).on(member.memberId.eq(memberJobTitleMap.memberId), memberJobTitleMap.deleted.isFalse())
                .leftJoin(jobTitle).on(memberJobTitleMap.jobTitleId.eq(jobTitle.jobTitleId))
                .leftJoin(memberJobPositionMap).on(member.memberId.eq(memberJobPositionMap.memberId), memberJobPositionMap.deleted.isFalse())
                .leftJoin(jobPosition).on(memberJobPositionMap.jobPositionId.eq(jobPosition.jobPositionId))
                .where(
                        member.deleted.isFalse(),
                        dept.deptId.eq(targetDeptId)
                )
                .fetch();

        Map<Long, MemberLightResponseDto> map = new LinkedHashMap<>();
        for (MemberLightResponseDto dto : flatResults) {
            MemberLightResponseDto mainDto = map.computeIfAbsent(dto.getMemberId(), id -> dto);

            if (mainDto != dto) {
                mainDto.addDeptInfo(dto.getDeptNm(), dto.getJobTitle());
            }
        }

        return new ArrayList<>(map.values());
    }
}
