package org.easyc.memberJobGradeMap.repository;

import org.easyc.memberJobGradeMap.entity.MemberJobGradeMap;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Repository
public interface MemberJobGradeMapRepository extends JpaRepository<MemberJobGradeMap, Long> {
    @EntityGraph(attributePaths = {"jobGrade"})
    Optional<MemberJobGradeMap> findByMemberId(Long memberId);

    @Modifying
    @Transactional
    @Query("UPDATE MemberJobGradeMap m SET m.deleted = true WHERE m.memberJobGradeMapId = :memberJobGradeMapId")
    void softDeleteById(Long memberJobGradeMapId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE MemberJobGradeMap m " +
            "SET m.deleted = true " +
            "WHERE m.memberId IN :memberIds " +
            "AND m.deleted = false")
    void bulkDeleteByMemberIds(
            @Param("memberIds") Set<Long> memberIds
    );
}
