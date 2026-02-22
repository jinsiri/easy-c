package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendanceChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceChangeRequestRepository extends JpaRepository<AttendanceChangeRequest, Long> {
    Optional<AttendanceChangeRequest> findTopByWorkDateAndRegisterUser_LoginId(LocalDate workDate, String loginId);
    List<AttendanceChangeRequest> findAllByWorkDateAndActiveTrueOrderByWorkRequestIdAsc(LocalDate workDate);
    List<AttendanceChangeRequest> findAllByRegisterUser_LoginIdAndWorkDateBetween(String loginId, LocalDate startDate, LocalDate endDate);
}
