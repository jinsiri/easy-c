package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendancePolicyMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AttendancePolicyMapRepository extends JpaRepository<AttendancePolicyMap, Long> {
    Optional<AttendancePolicyMap> findTopByLoginIdAndDeletedFalseOrderByMappingIdDesc(String loginId);
}
