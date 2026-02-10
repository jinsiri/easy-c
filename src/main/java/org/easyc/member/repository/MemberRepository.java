package org.easyc.member.repository;

import org.easyc.member.dto.MemberLightResponseDto;
import org.easyc.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    @Query("SELECT new org.easyc.member.dto.MemberLightResponseDto(m.memberId, m.memberNm, m.loginId, m.memberRole, m.accountStatus, " +
            "mp.employeeId, mp.email, mp.employmentType, mp.employmentStatus, " +
            "mp2.phoneNumber, " +
//            todo deptnm positiontitle
            "m.deleted, m.active, m.registerDate, m.registerIp, m.registerUser, " +
            "m.lastUpdateDate, m.lastUpdateIp, m.lastUpdateUser) "+
            "FROM Member m " +
            "left join MemberProfile mp on m.memberId = mp.memberId " +
            "left join MemberPersonal mp2 on m.memberId = mp2.memberId " +
            "where m.deleted = false")
    List<MemberLightResponseDto> findLightMembers();

    List<Member> findAllByDeletedFalseAndMemberIdIn(Collection<Long> memberIds);
    Optional<Member> findByMemberId(Long memberId);
    Optional<Member> findByDeletedFalseAndMemberId(Long memberId);
    Optional<Member> findByLoginId(String loginId);
    Optional<Member> findByDeletedFalseAndLoginId(String loginId);
    boolean existsByLoginId(String loginId);

    Member findAllByLoginId(String loginId);
}
