package org.easyc.memberJobPositionMap.repository;

import org.easyc.memberJobPositionMap.entity.MemberJobPositionMap;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface MemberJobPositionMapRepository extends JpaRepository<MemberJobPositionMap, Long> {
    @EntityGraph(attributePaths = {"jobPosition"})
    Optional<MemberJobPositionMap> findByMemberId(Long memberId);

    @Modifying
    @Transactional
    @Query("UPDATE MemberJobPositionMap m SET m.deleted = true WHERE m.memberJobPositionMapId = :memberJobPositionMapId")
    void softDeleteById(Long memberJobPositionMapId);
}
