package org.easyc.member.repository;

import org.easyc.member.entity.MemberRewardDiscipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRewardDisciplineRepository extends JpaRepository<MemberRewardDiscipline, Long> {

    List<MemberRewardDiscipline> findAllByMember_memberId(Long memberId);
}
