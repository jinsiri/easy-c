package org.easyc.deptMemberMap.repository;

import org.easyc.deptMemberMap.constant.DeptRole;
import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeptMemberMapRepository extends JpaRepository<DeptMemberMap, Long> {
    List<DeptMemberMap> findByMemberId(Long memberId);

    Optional<DeptMemberMap> findByDeptIdAndMemberId(Long deptId, Long memberId);

    Optional<DeptMemberMap> findByDeptIdAndDeptRole(Long deptId, DeptRole deptRole);

    @Query("SELECT dmm FROM DeptMemberMap dmm " +
            "LEFT JOIN FETCH dmm.dept " +
            "LEFT JOIN FETCH dmm.jobTitle " +
            "WHERE dmm.memberId = :memberId")
    List<DeptMemberMap> findAllByMemberIdWithFetchJoin(@Param("memberId") Long memberId);

    @Query("SELECT dmm FROM DeptMemberMap dmm " +
            "LEFT JOIN FETCH dmm.dept " +
            "LEFT JOIN FETCH dmm.jobTitle " +
            "WHERE dmm.memberId = :memberId AND dmm.isPrimary = true ORDER BY dmm.deptMemberMapId ASC Limit 1")
    DeptMemberMap findOneByMemberIdWithFetchJoinPrimaryTrue(@Param("memberId") Long memberId);
}
