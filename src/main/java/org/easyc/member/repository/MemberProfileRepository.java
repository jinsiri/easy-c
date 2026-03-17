package org.easyc.member.repository;

import org.easyc.member.entity.MemberProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface MemberProfileRepository extends JpaRepository<MemberProfile, Long> {
    MemberProfile findByMemberId(Long memberId);
    List<MemberProfile> findAllByMemberIdIsIn(Collection<Long> memberIdList);
}
