package org.easyc.attendance.repository;

import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByMemberIdAndWorkDate(Long memberId, LocalDate workDate);

    List<Attendance> findAllByWorkDate(LocalDate workDate);

    Optional<Attendance> findByMemberIdAndAttendanceId(Long memberId, Long attendanceId);

    List<Attendance> findAllByMemberIdAndWorkDateBetween(Long memberId, LocalDate workDateBefore, LocalDate workDateAfter);
}
