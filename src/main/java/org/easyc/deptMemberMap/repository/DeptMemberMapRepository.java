package org.easyc.deptMemberMap.repository;

import org.easyc.deptMemberMap.constant.DeptRole;
import org.easyc.deptMemberMap.dto.DeptMemberFlatDto;
import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface DeptMemberMapRepository extends JpaRepository<DeptMemberMap, Long> {
    List<DeptMemberMap> findByMemberId(Long memberId);

    Optional<DeptMemberMap> findByDeptIdAndMemberId(Long deptId, Long memberId);

    Optional<DeptMemberMap> findByDeptIdAndDeptRole(Long deptId, DeptRole deptRole);

    @Query("SELECT dmm FROM DeptMemberMap dmm " +
            "LEFT JOIN FETCH dmm.dept " +
            "LEFT JOIN FETCH dmm.jobTitle " +
            "WHERE dmm.memberId = :memberId ORDER BY dmm.isPrimary DESC")
    List<DeptMemberMap> findAllByMemberIdWithFetchJoin(@Param("memberId") Long memberId);

    @Query("SELECT dmm FROM DeptMemberMap dmm " +
            "LEFT JOIN FETCH dmm.dept " +
            "LEFT JOIN FETCH dmm.jobTitle " +
            "WHERE dmm.memberId = :memberId AND dmm.isPrimary = true ORDER BY dmm.deptMemberMapId ASC Limit 1")
    DeptMemberMap findOneByMemberIdWithFetchJoinPrimaryTrue(@Param("memberId") Long memberId);

    @Query("SELECT d.memberId FROM DeptMemberMap d " +
            "WHERE d.deptId = :targetDeptId AND d.memberId IN :memberIds AND d.deleted = false")
    List<Long> findExistingMemberIds(Long targetDeptId, Set<Long> memberIds);

    @Query("SELECT new org.easyc.deptMemberMap.dto.DeptMemberFlatDto(" +
            "dm.deptId, m.memberId, m.memberNm, jp.jobPositionNm, " +
            "COALESCE(jp.jobPositionLevel, 999)) " +
            "FROM DeptMemberMap dm " +
            "JOIN dm.member m " +
            "LEFT JOIN MemberJobPositionMap mjp ON m.memberId = mjp.memberId " +
            "LEFT JOIN mjp.jobPosition jp " +
            "WHERE m.deleted = false")
    List<DeptMemberFlatDto> findAllActiveDeptMembers();

    @Modifying
    @Query("UPDATE DeptMemberMap d SET d.deleted = true " +
            "WHERE d.deptId = :prevDeptId AND d.memberId IN :memberIds AND d.deleted = false")
    void deleteSpecificMapping(Long prevDeptId, Set<Long> memberIds);
}
