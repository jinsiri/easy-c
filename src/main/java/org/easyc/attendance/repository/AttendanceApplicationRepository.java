package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendanceApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceApplicationRepository extends JpaRepository<AttendanceApplication, Long> {
    Optional<AttendanceApplication> findTopByWorkDateAndMemberId(LocalDate workDate, Long memberId);

    List<AttendanceApplication> findAllByWorkDateAndActiveTrueOrderByAttendanceApplicationIdAsc(LocalDate workDate);
    List<AttendanceApplication> findAllByMemberIdAndActiveTrueAndWorkDateBetween(Long memberId, LocalDate startDate, LocalDate endDate);

    List<AttendanceApplication> findAllByActiveTrueOrderByAttendanceApplicationIdAsc();
    List<AttendanceApplication> findAllByDeptNmAndActiveTrueOrderByAttendanceApplicationIdAsc(String deptNm);
    List<AttendanceApplication> findAllByMemberNmContainsAndActiveTrueOrderByAttendanceApplicationIdAsc(String searchValue);

    List<AttendanceApplication> findAllByWorkDateAndDeptNmAndActiveTrueOrderByAttendanceApplicationIdAsc(LocalDate workDate, String deptNm);
    List<AttendanceApplication> findAllByWorkDateAndMemberNmContainsAndActiveTrueOrderByAttendanceApplicationIdAsc(LocalDate workDate, String memberNm);

    List<AttendanceApplication> findAllByMemberIdAndWorkDateBetween(Long memberId, LocalDate workDateAfter, LocalDate workDateBefore);
}
