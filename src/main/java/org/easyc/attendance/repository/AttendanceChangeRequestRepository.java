package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendanceChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceChangeRequestRepository extends JpaRepository<AttendanceChangeRequest, Long> {
    List<AttendanceChangeRequest> findAllByWorkDateAndActiveTrueOrderByWorkRequestIdAsc(LocalDate workDate);
}
