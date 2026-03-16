package org.easyc.memberJobPositionMap.repository;

import org.easyc.memberJobPositionMap.entity.MemberJobPositionMap;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.List;

@Repository
public interface MemberJobPositionMapRepository extends JpaRepository<MemberJobPositionMap, Long> {
    @EntityGraph(attributePaths = {"jobPosition"})
    Optional<MemberJobPositionMap> findByMemberId(Long memberId);

    @Query("SELECT mjp.memberId AS memberId, jp.jobPositionNm AS jobPositionNm, jp.jobPositionLevel AS jobPositionLevel " +
            "FROM MemberJobPositionMap mjp " +
            "JOIN mjp.jobPosition jp " +
            "WHERE mjp.memberId IN :memberIds " +
            "ORDER BY jp.jobPositionLevel ASC")
    List<MemberJobPositionMap> findAllByMemberIdIn(@Param("memberIds") Set<Long> memberIds);

    @Modifying
    @Transactional
    @Query("UPDATE MemberJobPositionMap m SET m.deleted = true WHERE m.memberJobPositionMapId = :memberJobPositionMapId")
    void softDeleteById(Long memberJobPositionMapId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE MemberJobPositionMap m " +
            "SET m.deleted = true " +
            "WHERE m.memberId IN :memberIds " +
            "AND m.deleted = false")
    void bulkDeleteByMemberIds(
            @Param("memberIds") Set<Long> memberIds
    );
}
