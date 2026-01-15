package org.easyc.attendance.repository;

import org.easyc.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findAllByMemberIdAndWorkDateBetween(Long memberId, LocalDate workDateAfter, LocalDate workDateBefore);

    Attendance findAllByMemberIdAndWorkDate(Long memberId, LocalDate workDate);
}
