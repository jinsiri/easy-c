package org.easyc.member.repository;

import org.easyc.member.entity.MemberCareer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberCareerRepository extends JpaRepository<MemberCareer, Long> {
    List<MemberCareer> findAllByMember_memberId(Long memberId);
}