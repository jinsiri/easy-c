package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendancePolicyRepository extends JpaRepository<AttendancePolicy, Long> {
}
