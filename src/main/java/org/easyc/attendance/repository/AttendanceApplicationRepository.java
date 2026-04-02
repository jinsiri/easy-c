package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.common.constant.BasicStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceApplicationRepository extends JpaRepository<AttendanceApplication, Long> {
    List<AttendanceApplication> findAllByWorkDateAndMemberIdAndDeletedFalse(LocalDate workDate, Long memberId);
    List<AttendanceApplication> findAllByMemberIdAndWorkDateBetweenAndDeletedFalseOrderByWorkDate(Long memberId, LocalDate start, LocalDate end);

    List<AttendanceApplication> findTop10ByMemberIdAndWorkDateBetweenAndDeletedFalseOrderByWorkDateDesc(Long memberId, LocalDate start, LocalDate end);

    Optional<AttendanceApplication> findByAttendanceApplicationIdAndDeletedFalse(Long attendanceApplication);
}
