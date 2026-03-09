package org.easyc.memberJobPositionMap.repository;

import org.easyc.memberJobPositionMap.entity.MemberJobPositionMap;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberJobPositionMapRepository extends JpaRepository<MemberJobPositionMap, Long> {
    @EntityGraph(attributePaths = {"jobPosition"})
    Optional<MemberJobPositionMap> findByMemberId(Long memberId);
}
