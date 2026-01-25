package org.easyc.member.repository;

import org.easyc.member.entity.MemberQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberQualificationRepository extends JpaRepository<MemberQualification, Long> {
    List<MemberQualification> findAllByMember_memberId(Long memberId);
}
