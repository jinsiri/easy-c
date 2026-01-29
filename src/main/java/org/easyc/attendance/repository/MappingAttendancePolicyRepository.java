package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.entity.MappingAttendancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MappingAttendancePolicyRepository extends JpaRepository<MappingAttendancePolicy, Long> {
    Optional<MappingAttendancePolicy> findTopByMemberIdOrderByAttendancePolicyIdDesc(Long memberId);
}
