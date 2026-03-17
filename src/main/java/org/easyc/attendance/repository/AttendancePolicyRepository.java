package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendancePolicyRepository extends JpaRepository<AttendancePolicy, Long> {
    Optional<AttendancePolicy> findByAttendancePolicyIdAndActiveTrue(Long attendancePolicyId);
    List<AttendancePolicy> findAllByActiveTrueOrderByAttendancePolicyIdAsc();

}
