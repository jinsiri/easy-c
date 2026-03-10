package org.easyc.memberJobRoleMap.repository;

import org.easyc.memberJobRoleMap.entity.MemberJobRoleMap;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface MemberJobRoleMapRepository extends JpaRepository<MemberJobRoleMap, Long> {
    @EntityGraph(attributePaths = {"jobRole"})
    Optional<MemberJobRoleMap> findByMemberId(Long memberId);

    @Modifying
    @Transactional
    @Query("UPDATE MemberJobRoleMap m SET m.deleted = true WHERE m.memberJobRoleMapId = :memberJobRoleMapId")
    void softDeleteById(Long memberJobRoleMapId);
}
