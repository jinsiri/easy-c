package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendancePolicyMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendancePolicyMapRepository extends JpaRepository<AttendancePolicyMap, Long> {
    Optional<AttendancePolicyMap> findTopByMemberIdAndDeletedFalseOrderByMappingIdDesc(Long memberId);

    @Query("SELECT a.attendancePolicyId, count(a) FROM AttendancePolicyMap a GROUP BY a.attendancePolicyId")
    List<Object[]> countGroupByAttendancePolicyId();

    List<AttendancePolicyMap> findAllByMemberIdIsIn(List<Long> memberIdList);
}
