package org.easyc.member.repository;

import org.easyc.member.entity.MemberQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface MemberQualificationRepository extends JpaRepository<MemberQualification, Long> {
    List<MemberQualification> findAllByMember_memberId(Long memberId);

    @Modifying
    @Query("update MemberQualification set deleted = true, active = false, lastUpdateDate = CURRENT_TIMESTAMP where member.memberId = ?1")
    void deleteByMemberId(Long memberId);


    @Modifying
    @Query("update MemberQualification set deleted = true, active = false, lastUpdateDate = CURRENT_TIMESTAMP where member.memberId in ?1")
    void deleteByMemberIds(Collection<Long> memberId);
}
