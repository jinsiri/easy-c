package org.easyc.memberJobGradeMap.repository;

import org.easyc.memberJobGradeMap.entity.MemberJobGradeMap;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberJobGradeMapRepository extends JpaRepository<MemberJobGradeMap, Long> {
    @EntityGraph(attributePaths = {"jobGrade"})
    Optional<MemberJobGradeMap> findByMemberId(Long memberId);
}
